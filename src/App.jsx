import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LivroPage from "./pages/LivroPage";
import QuizPage from "./pages/QuizPage";
import ReinosPage from "./pages/ReinosPage";
import GaleriaPage from "./pages/GaleriaPage";
import AutorPage from "./pages/AutorPage";
import DownloadsPage from "./pages/DownloadsPage";
import KingdomPage from "./pages/KingdomPage";
import NotFoundPage from "./pages/NotFoundPage";
import SEO from "./components/SEO";

function PageReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    window.requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <div className="page-container">
        <SEO />
        <PageReset />
        <a className="skip-link" href="#main-content">
          Ir para o conteúdo principal
        </a>
        <Header />
        <div id="main-content" className="content-wrap" tabIndex="-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/livro" element={<LivroPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/reinos" element={<ReinosPage />} />
            <Route path="/galeria" element={<GaleriaPage />} />
            <Route path="/autor" element={<AutorPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/:slug" element={<KingdomPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
