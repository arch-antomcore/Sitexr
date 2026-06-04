from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Coleciona API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

CATEGORIES = ["figures", "carrinhos", "anime", "games", "outros"]

SCRAPE_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


# ----------------------------- Models -----------------------------
class Post(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    image: Optional[str] = None
    group_url: str
    current_price: Optional[str] = None
    original_price: Optional[str] = None
    current_price_num: Optional[float] = None
    original_price_num: Optional[float] = None
    discount: Optional[int] = None
    currency: str = "R$"
    category: str = "outros"
    description: Optional[str] = None
    joined_count: int = 0
    likes: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class PostCreate(BaseModel):
    title: str
    image: Optional[str] = None
    images: Optional[List[str]] = None
    group_url: str
    current_price: Optional[str] = None
    original_price: Optional[str] = None
    currency: str = "R$"
    category: str = "outros"
    description: Optional[str] = None


class ScrapeRequest(BaseModel):
    url: str


# --------------------------- Helpers ------------------------------
def parse_price_number(s: Optional[str]) -> Optional[float]:
    if not s:
        return None
    s = re.sub(r"[^\d.,]", "", str(s))
    if not s:
        return None
    try:
        if "," in s and "." in s:
            if s.rfind(",") > s.rfind("."):
                s = s.replace(".", "").replace(",", ".")
            else:
                s = s.replace(",", "")
        elif "," in s:
            if re.search(r",\d{1,2}$", s):
                s = s.replace(".", "").replace(",", ".")
            else:
                s = s.replace(",", "")
        return round(float(s), 2)
    except ValueError:
        return None


def compute_discount(current: Optional[float], original: Optional[float]) -> Optional[int]:
    if current and original and original > current > 0:
        return int(round((1 - current / original) * 100))
    return None


def guess_category(text: str) -> str:
    t = (text or "").lower()
    rules = [
        ("carrinhos", ["hot wheels", "hotwheels", "diecast", "die-cast", "1:64", "1/64",
                        "1:18", "miniatura carro", "carrinho", "tomica", "matchbox", "car model"]),
        ("anime", ["anime", "naruto", "dragon ball", "one piece", "demon slayer", "nendoroid",
                   "manga", "goku", "luffy", "figma"]),
        ("games", ["game", "playstation", "xbox", "nintendo", "zelda", "mario", "sonic",
                   "pokemon", "amiibo", "controller"]),
        ("figures", ["figure", "figura", "action figure", "statue", "estatua", "estátua",
                     "marvel", "dc", "funko", "pop!", "colecionavel", "collectible", "model kit",
                     "gundam", "boneco"]),
    ]
    for cat, kws in rules:
        for kw in kws:
            if kw in t:
                return cat
    return "outros"


PRODUCT_ID_PATTERNS = [
    r"/item/(\d{8,16})",
    r"/(\d{10,16})\.html",
    r"[?&](?:productId|objectId|itemId|product_id|productIds)=(\d{8,16})",
    r"/i/(\d{8,16})",
    r"/p/[a-z0-9\-]*?/?(\d{10,16})",
]


def extract_product_id(*sources) -> Optional[str]:
    for s in sources:
        if not s:
            continue
        for pat in PRODUCT_ID_PATTERNS:
            m = re.search(pat, s)
            if m:
                return m.group(1)
    for s in sources:
        if not s:
            continue
        runs = re.findall(r"\d{10,16}", s)
        if runs:
            return max(runs, key=len)
    return None


def _clean_title(t: Optional[str]) -> Optional[str]:
    if not t:
        return None
    t = re.sub(r"\s*[-|–]\s*AliExpress.*$", "", t, flags=re.IGNORECASE).strip()
    return t or None


def _norm_img(u: Optional[str]) -> Optional[str]:
    if not u:
        return None
    u = u.strip()
    if u.startswith("//"):
        u = "https:" + u
    return u


def _meta(soup, *keys) -> Optional[str]:
    for k in keys:
        tag = soup.find("meta", property=k) or soup.find("meta", attrs={"name": k})
        if tag and tag.get("content"):
            return tag["content"].strip()
    return None


def _parse_page(html: str) -> dict:
    soup = BeautifulSoup(html, "lxml")
    title = _clean_title(_meta(soup, "og:title", "twitter:title"))
    if not title and soup.title and soup.title.string:
        title = _clean_title(soup.title.string.strip())
    image = _norm_img(_meta(soup, "og:image", "twitter:image", "twitter:image:src"))
    description = _meta(soup, "og:description", "description", "twitter:description")

    images = []
    m = re.search(r'"imagePathList"\s*:\s*(\[[^\]]*\])', html)
    if m:
        try:
            arr = json.loads(m.group(1))
            images = [_norm_img(x) for x in arr if isinstance(x, str)]
        except Exception:
            pass
    if image:
        images = [image] + [i for i in images if i and i != image]
    images = [i for i in images if i][:8]

    candidates = []
    for pat in [
        r'"formatedActivityPrice"\s*:\s*"([^"]+)"',
        r'"formatedPrice"\s*:\s*"([^"]+)"',
        r'"salePrice"\s*:\s*"([^"]+)"',
    ]:
        candidates.extend(re.findall(pat, html))
    og_price = _meta(soup, "og:price:amount", "product:price:amount")
    if og_price:
        candidates.append(og_price)

    return {
        "title": title,
        "image": image,
        "images": images,
        "description": description,
        "price_candidates": candidates,
    }


def _scrape_sync(url: str) -> dict:
    result = {
        "ok": False, "title": None, "image": None, "images": [],
        "description": None, "current_price": None, "original_price": None,
        "currency": "R$", "final_url": url, "category": "outros", "product_id": None,
    }
    try:
        # 1) Resolve the pasted link (follows short / affiliate / group links).
        resp = requests.get(url, headers=SCRAPE_HEADERS, timeout=18, allow_redirects=True)
        final_url = str(resp.url)
        result["final_url"] = final_url
        html = resp.text or ""
        parsed = _parse_page(html)

        # 2) Resolve the product id and fetch the canonical item page, which
        #    reliably exposes og:image + the full image gallery + title.
        pid = extract_product_id(final_url, url, html[:300000])
        result["product_id"] = pid
        if pid and not parsed["image"]:
            for host in ("https://www.aliexpress.com", "https://pt.aliexpress.com"):
                try:
                    r2 = requests.get(f"{host}/item/{pid}.html",
                                      headers=SCRAPE_HEADERS, timeout=18, allow_redirects=True)
                    p2 = _parse_page(r2.text or "")
                    if p2["image"]:
                        parsed = {
                            "title": parsed["title"] or p2["title"],
                            "image": p2["image"],
                            "images": p2["images"] or parsed["images"],
                            "description": parsed["description"] or p2["description"],
                            "price_candidates": parsed["price_candidates"] or p2["price_candidates"],
                        }
                        break
                except Exception:
                    continue

        # 3) Last resort: an alicdn image embedded directly in the pasted URL.
        if not parsed["image"]:
            from urllib.parse import unquote
            decoded = unquote(url)
            m = re.search(r"https?://[^\"'\s&]*alicdn[^\"'\s&]*\.(?:jpg|jpeg|png|webp)", decoded, re.IGNORECASE)
            if m:
                parsed["image"] = _norm_img(m.group(0))
                parsed["images"] = [parsed["image"]]

        # Prices (best-effort; AliExpress loads final price via XHR).
        num_to_str = {}
        for c in parsed["price_candidates"]:
            n = parse_price_number(c)
            if n and n > 0 and n not in num_to_str:
                num_to_str[n] = c.strip()
        if num_to_str:
            nums = sorted(num_to_str.keys())
            result["current_price"] = num_to_str[nums[0]]
            if len(nums) > 1:
                result["original_price"] = num_to_str[nums[-1]]

        result["title"] = parsed["title"]
        result["image"] = parsed["image"]
        result["images"] = parsed["images"]
        result["description"] = parsed["description"]
        result["category"] = guess_category(f"{parsed['title']} {parsed['description']}")
        result["ok"] = bool(parsed["title"] or parsed["image"])
    except Exception as e:  # best-effort scraping
        logger.warning(f"Scrape failed for {url}: {e}")
        result["error"] = str(e)
    return result


# ---------------------------- Routes ------------------------------
@api_router.get("/")
async def root():
    return {"message": "Coleciona API online"}


@api_router.post("/scrape")
async def scrape(req: ScrapeRequest):
    if not req.url or not req.url.startswith("http"):
        raise HTTPException(status_code=400, detail="URL inválida")
    data = await asyncio.to_thread(_scrape_sync, req.url)
    return data


@api_router.post("/posts", response_model=Post)
async def create_post(payload: PostCreate):
    if not payload.group_url.startswith("http"):
        raise HTTPException(status_code=400, detail="Link do grupo inválido")
    cur_num = parse_price_number(payload.current_price)
    orig_num = parse_price_number(payload.original_price)
    category = payload.category if payload.category in CATEGORIES else "outros"

    images = payload.images if payload.images else ([payload.image] if payload.image else [])
    post = Post(
        title=payload.title.strip(),
        image=payload.image or (images[0] if images else None),
        images=images,
        group_url=payload.group_url.strip(),
        current_price=payload.current_price,
        original_price=payload.original_price,
        current_price_num=cur_num,
        original_price_num=orig_num,
        discount=compute_discount(cur_num, orig_num),
        currency=payload.currency or "R$",
        category=category,
        description=payload.description,
    )
    await db.posts.insert_one(post.model_dump())
    return post


@api_router.get("/posts", response_model=List[Post])
async def list_posts(category: Optional[str] = None, sort: str = "recent", q: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    if q:
        query["title"] = {"$regex": re.escape(q), "$options": "i"}

    docs = await db.posts.find(query, {"_id": 0}).to_list(1000)

    if sort == "price_asc":
        docs.sort(key=lambda d: (d.get("current_price_num") is None, d.get("current_price_num") or 0))
    elif sort == "discount":
        docs.sort(key=lambda d: d.get("discount") or 0, reverse=True)
    elif sort == "popular":
        docs.sort(key=lambda d: d.get("joined_count") or 0, reverse=True)
    else:  # recent
        docs.sort(key=lambda d: d.get("created_at") or "", reverse=True)

    return docs


@api_router.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: str):
    doc = await db.posts.find_one({"id": post_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Post não encontrado")
    return doc


@api_router.post("/posts/{post_id}/join", response_model=Post)
async def join_group(post_id: str):
    doc = await db.posts.find_one_and_update(
        {"id": post_id}, {"$inc": {"joined_count": 1}},
        return_document=True, projection={"_id": 0},
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Post não encontrado")
    return doc


@api_router.post("/posts/{post_id}/like", response_model=Post)
async def like_post(post_id: str):
    doc = await db.posts.find_one_and_update(
        {"id": post_id}, {"$inc": {"likes": 1}},
        return_document=True, projection={"_id": 0},
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Post não encontrado")
    return doc


@api_router.get("/stats")
async def stats():
    total = await db.posts.count_documents({})
    return {"groups": total, "products": total}


# --------------------------- Seed ---------------------------------
SEED_POSTS = [
    {
        "title": "Figure Goku Ultra Instinct Premium 28cm — Estátua Colecionável",
        "image": "https://images.unsplash.com/photo-1762008387452-25fe91ab3f90?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwzfHxhY3Rpb24lMjBmaWd1cmUlMjBjb2xsZWN0aWJsZSUyMGRhcmt8ZW58MHx8fHwxNzgwNTc2NzI3fDA&ixlib=rb-4.1.0&q=85",
        "group_url": "https://www.aliexpress.com/item/1005006274052609.html",
        "current_price": "R$89,90", "original_price": "R$349,00",
        "category": "anime", "joined_count": 47, "likes": 132,
        "description": "Estátua de PVC pintada à mão, base inclusa. Lacre de fábrica, 28cm de altura.",
    },
    {
        "title": "Miniatura Carro Esportivo 1:18 Die-cast Metal Portas Abrem",
        "image": "https://images.unsplash.com/photo-1645400379459-f6fd3d963fd4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwyfHxkaWVjYXN0JTIwbW9kZWwlMjBjYXIlMjBkYXJrfGVufDB8fHx8MTc4MDU3NjcyN3ww&ixlib=rb-4.1.0&q=85",
        "group_url": "https://www.aliexpress.com/item/1005011820423579.html",
        "current_price": "R$64,39", "original_price": "R$199,90",
        "category": "carrinhos", "joined_count": 31, "likes": 88,
        "description": "Réplica em metal escala 1:18, rodas que giram, capô e portas funcionais.",
    },
    {
        "title": "Action Figure Cavaleiro Sombrio Articulado 18cm + Acessórios",
        "image": "https://images.pexels.com/photos/37737303/pexels-photo-37737303.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "group_url": "https://www.aliexpress.com/item/1005009136755291.html",
        "current_price": "R$72,50", "original_price": "R$210,00",
        "category": "figures", "joined_count": 64, "likes": 201,
        "description": "Mais de 20 pontos de articulação, mãos intercambiáveis e suporte de exposição.",
    },
    {
        "title": "Kit 3 Carrinhos Colecionáveis 1:64 Edição Limitada",
        "image": "https://images.pexels.com/photos/1863235/pexels-photo-1863235.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "group_url": "https://www.aliexpress.com/item/1005005711560515.html",
        "current_price": "R$39,90", "original_price": "R$129,00",
        "category": "carrinhos", "joined_count": 22, "likes": 57,
        "description": "Trio de miniaturas die-cast escala 1:64, pintura metálica premium.",
    },
    {
        "title": "Figure Anime Espadachim 25cm Base LED Colecionável",
        "image": "https://images.pexels.com/photos/37737302/pexels-photo-37737302.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "group_url": "https://www.aliexpress.com/item/1005008547784753.html",
        "current_price": "R$118,00", "original_price": "R$399,00",
        "category": "anime", "joined_count": 89, "likes": 274,
        "description": "Estátua com base iluminada por LED, efeitos translúcidos e detalhes pintados.",
    },
    {
        "title": "Mini Figure Herói Retro Pixel Art 10cm Vinil",
        "image": "https://images.unsplash.com/photo-1668263019414-e71dbcd2dc80?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHw0fHxkaWVjYXN0JTIwbW9kZWwlMjBjYXIlMjBkYXJrfGVufDB8fHx8MTc4MDU3NjcyN3ww&ixlib=rb-4.1.0&q=85",
        "group_url": "https://www.aliexpress.com/item/1005012130094133.html",
        "current_price": "R$29,90", "original_price": "R$99,90",
        "category": "games", "joined_count": 18, "likes": 44,
        "description": "Figura de vinil estilo retro game, ideal para setup e estante gamer.",
    },
]


@app.on_event("startup")
async def seed_posts():
    try:
        count = await db.posts.count_documents({})
        if count == 0:
            now = datetime.now(timezone.utc)
            docs = []
            for i, s in enumerate(SEED_POSTS):
                cur_num = parse_price_number(s["current_price"])
                orig_num = parse_price_number(s["original_price"])
                post = Post(
                    title=s["title"], image=s["image"], group_url=s["group_url"],
                    current_price=s["current_price"], original_price=s["original_price"],
                    current_price_num=cur_num, original_price_num=orig_num,
                    discount=compute_discount(cur_num, orig_num),
                    category=s["category"], description=s["description"],
                    joined_count=s["joined_count"], likes=s["likes"],
                    created_at=now.isoformat(),
                )
                docs.append(post.model_dump())
            await db.posts.insert_many(docs)
            logger.info(f"Seeded {len(docs)} posts")
    except Exception as e:
        logger.error(f"Seed failed: {e}")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
