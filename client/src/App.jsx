import { useEffect, useState } from "react";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { DARK, LIGHT, ThemeContext } from "./context/ThemeContext";
import { initialApps } from "./data/apps";
import AdminLoginPage from "./pages/AdminLoginPage";
import DetailPage from "./pages/DetailPage";
import DirectoryPage from "./pages/DirectoryPage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ADMIN_TOKEN_KEY = "adr_admin_token";

export default function App() {
  const [dark, setDark] = useState(false);
  const [admin, setAdmin] = useState(null);
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

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;

    const verifySession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok || !data.ok) {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          setAdmin(null);
          return;
        }
        setAdmin(data.admin);
      } catch (_err) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setAdmin(null);
      }
    };

    verifySession();
  }, []);

  const goToAdminLogin = () => {
    setPage("admin-login");
    setSelectedApp(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLoginSuccess = ({ token, admin: adminData }) => {
    if (!token || !adminData) return;
    setAdmin(adminData);
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    goToDirectory();
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    goToDirectory();
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ minHeight: "100vh", background: theme.t.bg, color: theme.t.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <Navbar
          onLogoClick={goToDirectory}
          isAdmin={Boolean(admin)}
          onOpenAdminLogin={goToAdminLogin}
          onLogout={handleAdminLogout}
        />
        {page === "directory" && <DirectoryPage apps={apps} onViewDetail={goToDetail} isAdmin={Boolean(admin)} onAddApp={handleAddApp} />}
        {page === "admin-login" && <AdminLoginPage onBack={goToDirectory} onLoginSuccess={handleAdminLoginSuccess} />}
        {page === "detail" && selectedApp && <DetailPage app={selectedApp} onBack={goToDirectory} />}
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}