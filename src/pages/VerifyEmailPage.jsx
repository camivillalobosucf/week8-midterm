import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { sendVerificationEmail, logOut } from "../services/authService";

export default function VerifyEmailPage() {
  const { currentUser, refreshUser } = useAuth();
  const [resent, setResent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    try {
      await sendVerificationEmail();
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch {
      setError("Could not resend email. Please try again in a moment.");
    }
  };

  const handleCheckVerified = async () => {
    setChecking(true);
    setError("");
    await refreshUser();
    // If still not verified after refresh, show a message
    if (!currentUser?.emailVerified) {
      setError("Email not verified yet. Please click the link in your inbox.");
    }
    setChecking(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/logo-stacked.png" alt="BabyTrack" className="auth-logo" />
        <div className="verify-icon">📧</div>
        <h1 className="auth-title" style={{ fontSize: "1.6rem" }}>Check your email</h1>
        <p className="auth-subtitle" style={{ marginBottom: "0.5rem" }}>
          We sent a verification link to
        </p>
        <p className="verify-email">{currentUser?.email}</p>
        <p className="verify-hint">
          Click the link in the email to activate your account, then come back here.
        </p>

        {error && <p className="auth-error">{error}</p>}
        {resent && <p className="verify-success">Verification email resent!</p>}

        <div className="verify-actions">
          <button className="auth-btn" onClick={handleCheckVerified} disabled={checking}>
            {checking ? "Checking..." : "I've verified — continue"}
          </button>
          <button className="btn-cancel" onClick={handleResend}>
            Resend email
          </button>
        </div>

        <p className="auth-switch" style={{ marginTop: "1.5rem" }}>
          Wrong account?{" "}
          <button
            onClick={() => logOut()}
            style={{ background: "none", border: "none", color: "#d46fa8", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}
          >
            Log out
          </button>
        </p>
      </div>
    </div>
  );
}
