import { Link } from "react-router-dom";

const features = [
  { icon: "🍼", title: "Feeding Tracker", desc: "Log breast, bottle, or solid feedings with time and notes.", accent: "pink" },
  { icon: "🧷", title: "Diaper Tracker", desc: "Record wet, dirty, or mixed diaper changes quickly.", accent: "peach" },
  { icon: "😴", title: "Sleep Tracker", desc: "Track naps and nighttime sleep with start and end times.", accent: "cream" },
  { icon: "✏️", title: "Edit & Delete Entries", desc: "Update or remove any logged entry at any time.", accent: "yellow" },
  { icon: "📊", title: "Daily Summary Dashboard", desc: "View a quick overview of your baby's day at a glance.", accent: "blue" },
];

const techStack = ["React", "Vite", "Firebase Auth", "Cloud Firestore", "CSS", "GitHub"];

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="hero">
        <h1 className="hero-title">
          BabyTrack <span className="hero-emoji">👶</span>
        </h1>
        <p className="hero-tagline">
          A simple web app that helps parents log feedings, diaper changes, and
          sleep — all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="hero-btn hero-btn--primary">Get Started</Link>
          <Link to="/login" className="hero-btn hero-btn--secondary">Log In</Link>
        </div>
      </header>

      <h2 className="section-title">Features</h2>
      <div className="cards">
        {features.map((f) => (
          <div className={`card card--${f.accent}`} key={f.title}>
            <div className="card-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Tech Stack</h2>
      <ul className="tech-list">
        {techStack.map((tech) => (
          <li className="tech-pill" key={tech}>{tech}</li>
        ))}
      </ul>

      <footer className="landing-footer">
        BabyTrack &mdash; Week 8 Project &bull; 2026
      </footer>
    </div>
  );
}
