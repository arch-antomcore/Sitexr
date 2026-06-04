import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";

function App() {
  return (
    <div className="App grain">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fafafa",
            fontFamily: "Outfit, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;
