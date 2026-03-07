import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { signUp, getAuthErrorMessage } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

export default function SignupPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (currentUser) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return setError("Passwords do not match.");
    }
    setError("");
    setLoading(true);
    try {
      await signUp(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">BabyTrack 👶</h1>
        <h2 className="auth-subtitle">Create your account</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
