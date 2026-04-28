import { useState } from "react";
import { useT } from "../context/ThemeContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLoginPage({ onBack, onLoginSuccess }) {
  const { t } = useT();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    background: t.input,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 13,
    color: t.text,
    outline: "none",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      onLoginSuccess(data);
    } catch (_err) {
      setError("Unable to reach server. Please make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "42px 24px 24px" }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: 16,
          fontSize: 12,
          color: t.textSub,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        ← Back to directory
      </button>

      <div
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h1 style={{ margin: "0 0 6px 0", fontSize: 22, color: t.text }}>Admin Login</h1>
        <p style={{ margin: "0 0 18px 0", fontSize: 13, color: t.textHint }}>
          Sign in with admin credentials to manage applications.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: t.textSub }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin"
              style={inputStyle}
              autoComplete="username"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: t.textSub }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={inputStyle}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              style={{
                fontSize: 12,
                color: t.red,
                background: t.redLight,
                border: `1px solid ${t.redBorder}`,
                borderRadius: 8,
                padding: "8px 10px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 2,
              fontSize: 13,
              fontWeight: 700,
              padding: "10px 12px",
              borderRadius: 8,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: t.red,
              color: "#fff",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign in as admin"}
          </button>
        </form>
      </div>
    </main>
  );
}
