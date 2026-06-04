"""Backend API tests for Coleciona group-buy app."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://mini-group-buy.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ---------- Health / Root ----------
def test_root(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    assert "Coleciona" in r.json().get("message", "")


# ---------- Stats / Seed ----------
def test_stats_has_seed(s):
    r = s.get(f"{API}/stats")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data.get("groups"), int)
    assert data["groups"] >= 6, f"Expected at least 6 seeded posts, got {data['groups']}"


# ---------- List posts: filters, sort, search ----------
def test_list_posts_all(s):
    r = s.get(f"{API}/posts")
    assert r.status_code == 200
    posts = r.json()
    assert isinstance(posts, list)
    assert len(posts) >= 6
    p = posts[0]
    for f in ("id", "title", "group_url", "category", "current_price", "joined_count", "likes"):
        assert f in p


def test_list_posts_category_filter(s):
    r = s.get(f"{API}/posts", params={"category": "carrinhos"})
    assert r.status_code == 200
    posts = r.json()
    assert len(posts) >= 1
    assert all(p["category"] == "carrinhos" for p in posts)


def test_list_posts_empty_category(s):
    # Valid category but no seeded posts of this type
    r = s.get(f"{API}/posts", params={"category": "outros"})
    assert r.status_code == 200
    # seed has no "outros" items
    assert all(p["category"] == "outros" for p in r.json())


def test_list_posts_sort_price_asc(s):
    r = s.get(f"{API}/posts", params={"sort": "price_asc"})
    assert r.status_code == 200
    nums = [p.get("current_price_num") for p in r.json() if p.get("current_price_num") is not None]
    assert nums == sorted(nums), "price_asc not sorted ascending"


def test_list_posts_sort_discount(s):
    r = s.get(f"{API}/posts", params={"sort": "discount"})
    assert r.status_code == 200
    discs = [p.get("discount") or 0 for p in r.json()]
    assert discs == sorted(discs, reverse=True)


def test_list_posts_sort_popular(s):
    r = s.get(f"{API}/posts", params={"sort": "popular"})
    assert r.status_code == 200
    jc = [p.get("joined_count") or 0 for p in r.json()]
    assert jc == sorted(jc, reverse=True)


def test_list_posts_search_q(s):
    r = s.get(f"{API}/posts", params={"q": "Goku"})
    assert r.status_code == 200
    posts = r.json()
    assert len(posts) >= 1
    assert any("goku" in p["title"].lower() for p in posts)


# ---------- Get single post ----------
def test_get_post_by_id(s):
    posts = s.get(f"{API}/posts").json()
    pid = posts[0]["id"]
    r = s.get(f"{API}/posts/{pid}")
    assert r.status_code == 200
    assert r.json()["id"] == pid


def test_get_post_404(s):
    r = s.get(f"{API}/posts/does-not-exist-xyz")
    assert r.status_code == 404


# ---------- Scrape ----------
def test_scrape_example_com_returns_200(s):
    r = s.post(f"{API}/scrape", json={"url": "https://example.com"})
    assert r.status_code == 200
    data = r.json()
    # Should be a dict with expected keys; values may be null
    for key in ("title", "image", "current_price", "original_price", "category"):
        assert key in data


def test_scrape_invalid_url(s):
    r = s.post(f"{API}/scrape", json={"url": "not-a-url"})
    assert r.status_code == 400


def test_scrape_aliexpress_returns_image_and_title(s):
    """MOST IMPORTANT: AliExpress scrape must return ok=true with non-null image+title and product_id."""
    url = "https://pt.aliexpress.com/item/1005006274052609.html"
    r = s.post(f"{API}/scrape", json={"url": url}, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("ok") is True, f"ok must be true, got {data}"
    assert data.get("image"), f"image must be non-null, got {data}"
    assert "alicdn" in (data.get("image") or "").lower(), f"image should be alicdn URL, got {data.get('image')}"
    assert data.get("title"), "title must be non-null"
    assert isinstance(data.get("images"), list) and len(data["images"]) >= 1
    # AliExpress may redirect to US gateway and reassign product_id; just require a numeric id was resolved.
    assert data.get("product_id") and str(data["product_id"]).isdigit(), f"product_id missing: {data.get('product_id')}"


# ---------- Create post + discount computation ----------
def test_create_post_computes_discount_and_persists(s):
    payload = {
        "title": "TEST_Figure Sample Premium 30cm",
        "image": "https://example.com/img.jpg",
        "group_url": "https://www.aliexpress.com/item/TEST.html",
        "current_price": "R$100,00",
        "original_price": "R$400,00",
        "category": "figures",
        "description": "TEST seed item",
    }
    r = s.post(f"{API}/posts", json=payload)
    assert r.status_code == 200, r.text
    post = r.json()
    assert post["title"] == payload["title"]
    assert post["category"] == "figures"
    assert post["current_price_num"] == 100.0
    assert post["original_price_num"] == 400.0
    assert post["discount"] == 75
    assert post["joined_count"] == 0
    assert post["likes"] == 0
    pid = post["id"]

    # Verify via GET
    g = s.get(f"{API}/posts/{pid}")
    assert g.status_code == 200
    assert g.json()["discount"] == 75


def test_create_post_invalid_url(s):
    r = s.post(f"{API}/posts", json={"title": "X", "group_url": "javascript:1"})
    assert r.status_code == 400


def test_create_post_unknown_category_defaults_outros(s):
    payload = {
        "title": "TEST_Unknown Cat",
        "group_url": "https://example.com/x",
        "current_price": "R$10,00",
        "category": "rogue",
    }
    r = s.post(f"{API}/posts", json=payload)
    assert r.status_code == 200
    assert r.json()["category"] == "outros"


# ---------- Join + Like ----------
def test_join_and_like_increment(s):
    # Create a fresh post
    payload = {
        "title": "TEST_Join Like Counter",
        "group_url": "https://example.com/jl",
        "current_price": "R$10,00",
        "original_price": "R$20,00",
        "category": "figures",
    }
    pid = s.post(f"{API}/posts", json=payload).json()["id"]

    j1 = s.post(f"{API}/posts/{pid}/join")
    assert j1.status_code == 200
    assert j1.json()["joined_count"] == 1
    j2 = s.post(f"{API}/posts/{pid}/join")
    assert j2.json()["joined_count"] == 2

    l1 = s.post(f"{API}/posts/{pid}/like")
    assert l1.status_code == 200
    assert l1.json()["likes"] == 1

    # Verify persistence
    g = s.get(f"{API}/posts/{pid}").json()
    assert g["joined_count"] == 2
    assert g["likes"] == 1


def test_join_404(s):
    r = s.post(f"{API}/posts/missing/join")
    assert r.status_code == 404


def test_like_404(s):
    r = s.post(f"{API}/posts/missing/like")
    assert r.status_code == 404
