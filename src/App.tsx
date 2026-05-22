import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { tools } from "./config/tools";

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans text-zinc-900 dark:text-zinc-200 selection:bg-indigo-200 dark:selection:bg-indigo-500/30 transition-colors duration-500">
        <Header />
        <main className="flex-1 max-w-400 mx-auto w-full p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            {tools.map((tool) => (
              <Route
                key={tool.slug}
                path={`/${tool.slug}`}
                element={<tool.component />}
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
