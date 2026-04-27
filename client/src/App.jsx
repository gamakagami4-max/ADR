import { useState } from "react";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { DARK, LIGHT, ThemeContext } from "./context/ThemeContext";
import { initialApps } from "./data/apps";
import DetailPage from "./pages/DetailPage";
import DirectoryPage from "./pages/DirectoryPage";

export default function App() {
  const [dark, setDark] = useState(false);
  const [role, setRole] = useState("user");
  const [page, setPage] = useState("directory");
  const [selectedApp, setSelectedApp] = useState(null);
  const [apps, setApps] = useState(initialApps);

  const theme = { t: dark ? DARK : LIGHT, dark, toggle: () => setDark((d) => !d) };

  const goToDetail = (app) => {
    setSelectedApp(app);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToDirectory = () => {
    setPage("directory");
    setSelectedApp(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddApp = (newApp) => {
    setApps((prev) => [newApp, ...prev]);
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ minHeight: "100vh", background: theme.t.bg, color: theme.t.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <Navbar onLogoClick={goToDirectory} role={role} onRoleChange={setRole} />
        {page === "directory" && <DirectoryPage apps={apps} onViewDetail={goToDetail} isAdmin={role === "admin"} onAddApp={handleAddApp} />}
        {page === "detail" && selectedApp && <DetailPage app={selectedApp} onBack={goToDirectory} />}
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}