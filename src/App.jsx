import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import EntriesPage from "./pages/EntriesPage";
import NewEntryPage from "./pages/NewEntryPage";
import DiaryPage from "./pages/DiaryPage";
import "./App.css";

function App() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      {currentUser ? (
        <div className="app-layout">
          <Sidebar />
          <main className="app-content">
            <Routes>
              <Route path="/dashboard"        element={<Dashboard />} />
              <Route path="/entries"          element={<EntriesPage />} />
              <Route path="/entries/new"      element={<NewEntryPage />} />
              <Route path="/entries/:id/edit" element={<NewEntryPage />} />
              <Route path="/diary"            element={<DiaryPage />} />
              <Route path="*"                 element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/"       element={<LandingPage />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*"       element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
