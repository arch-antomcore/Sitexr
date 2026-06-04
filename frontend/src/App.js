import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";

function App() {
  return (
    <div className="App grain">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        theme="light"
        toastOptions={{
          style: {
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.1)",
            color: "#121212",
            fontFamily: "Satoshi, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;
