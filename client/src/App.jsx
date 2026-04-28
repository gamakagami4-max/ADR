import { useEffect, useState } from "react";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { DARK, LIGHT, ThemeContext } from "./context/ThemeContext";
import AdminLoginPage from "./pages/AdminLoginPage";
import DetailPage from "./pages/DetailPage";
import DirectoryPage from "./pages/DirectoryPage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ADMIN_TOKEN_KEY = "adr_admin_token";

function summarizeAppPayload(app) {
  return {
    id: app?.id,
    name: app?.name,
    division: app?.division,
    platform: app?.platform,
    category: app?.category,
    featuresCount: Array.isArray(app?.features) ? app.features.length : 0,
    screenshotsCount: Array.isArray(app?.screenshots) ? app.screenshots.length : 0,
    iconLength: typeof app?.icon === "string" ? app.icon.length : 0,
    screenshotLengths: Array.isArray(app?.screenshots) ? app.screenshots.map((item) => (typeof item === "string" ? item.length : 0)) : [],
  };
}

async function readApiResponse(response, fallbackMessage, contextLabel) {
  const contentType = response.headers.get("content-type") || "";
  const responseText = await response.text();

  console.log(`[App] ${contextLabel} raw response`, {
    status: response.status,
    ok: response.ok,
    contentType,
    bodyPreview: responseText.slice(0, 500),
  });

  // Non-JSON response (proxy error page, nginx 502/504, CORS failure, etc.)
  if (!contentType.includes("application/json")) {
    if (!response.ok) {
      // Surface the actual HTTP status so it's obvious what went wrong
      const statusMsg = `Server error ${response.status}${response.statusText ? ` (${response.statusText})` : ""}`;
      // If the body looks like plain text (not HTML), include it too
      const bodyHint = responseText && !responseText.trim().startsWith("<")
        ? `: ${responseText.slice(0, 120)}`
        : "";
      throw new Error(`${statusMsg}${bodyHint}`);
    }
    return {};
  }

  let data = null;
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error(`[App] ${contextLabel} failed to parse JSON`, error);
      throw new Error(`Invalid JSON from server (status ${response.status}): ${responseText.slice(0, 120)}`);
    }
  }

  if (!response.ok || !data?.ok) {
    console.error(`[App] ${contextLabel} API error`, data);
    // data.message from the express handler is the most useful thing here
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [page, setPage] = useState("directory");
  const [selectedApp, setSelectedApp] = useState(null);
  const [editingApp, setEditingApp] = useState(null);
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsError, setAppsError] = useState("");

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

  // FIX: batch both state updates together so the modal opens
  // in the same render cycle — previously setEditingApp + setPage
  // could fire in separate renders causing the modal to miss the prop.
  const handleStartEditApp = (app) => {
    setEditingApp(app);
    setSelectedApp(null);
    setPage("directory");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseEditApp = () => {
    setEditingApp(null);
  };

  const handleAddApp = (newApp) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      throw new Error("Please login as admin.");
    }

    console.log("[App] Creating app", summarizeAppPayload(newApp));

    return fetch(`${API_BASE_URL}/api/apps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newApp),
    })
      .then(async (response) => {
        console.log("[App] Create response", response.status, response.headers.get("content-type"));
        const data = await readApiResponse(response, "Failed to save app. The upload may be too large.", "create");
        console.log("[App] Create succeeded", { id: data.app?.id, name: data.app?.name });
        setApps((prev) => [data.app, ...prev]);
      })
      .catch((error) => {
        console.error("[App] Create failed", error);
        throw error;
      });
  };

  const handleUpdateApp = (appId, updatedApp) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      throw new Error("Please login as admin.");
    }

    console.log("[App] Updating app", appId, summarizeAppPayload(updatedApp));

    return fetch(`${API_BASE_URL}/api/apps/${appId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedApp),
    }).then(async (response) => {
      console.log("[App] Update response", response.status, response.headers.get("content-type"));
      const data = await readApiResponse(response, "Failed to update app. The upload may be too large.", "update");
      console.log("[App] Update succeeded", { id: data.app?.id, name: data.app?.name });
      setApps((prev) => prev.map((item) => (item.id === appId ? data.app : item)));
      setSelectedApp((prev) => (prev?.id === appId ? data.app : prev));
      setEditingApp(null);
    }).catch((error) => {
      console.error("[App] Update failed", error);
      throw error;
    });
  };

  // FIX: unified delete handler — both AppCard (via DirectoryPage wrapper)
  // and DetailPage call this with just the appId string.
  const handleDeleteApp = (appId) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      throw new Error("Please login as admin.");
    }

    return fetch(`${API_BASE_URL}/api/apps/${appId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (response) => {
      await readApiResponse(response, "Failed to delete app.", "delete");
      setApps((prev) => prev.filter((item) => item.id !== appId));
      goToDirectory();
    });
  };

  useEffect(() => {
    const loadApps = async () => {
      setAppsLoading(true);
      setAppsError("");
      try {
        const response = await fetch(`${API_BASE_URL}/api/apps`);
        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Failed to load apps.");
        }
        const normalized = (data.apps || []).map((a) => ({ ...a, id: a.id || String(a._id) }));
        setApps(normalized);
      } catch (error) {
        setAppsError(error.message || "Failed to load apps.");
      } finally {
        setAppsLoading(false);
      }
    };

    loadApps();
  }, []);

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
      } catch {
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
        {page === "directory" && (
          <DirectoryPage
            apps={apps}
            loading={appsLoading}
            error={appsError}
            onViewDetail={goToDetail}
            isAdmin={Boolean(admin)}
            onAddApp={handleAddApp}
            onUpdateApp={handleUpdateApp}
            onDeleteApp={handleDeleteApp}
            editingApp={editingApp}
            onEditApp={handleStartEditApp}
            onCloseEditApp={handleCloseEditApp}
          />
        )}
        {page === "admin-login" && <AdminLoginPage onBack={goToDirectory} onLoginSuccess={handleAdminLoginSuccess} />}
        {page === "detail" && selectedApp && (
          <DetailPage
            app={selectedApp}
            onBack={goToDirectory}
            isAdmin={Boolean(admin)}
            onDeleteApp={handleDeleteApp}
            onEditApp={handleStartEditApp}
          />
        )}
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}