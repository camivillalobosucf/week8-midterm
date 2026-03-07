import { useNavigate, useParams } from "react-router-dom";
import { useEntries } from "../hooks/useEntries";
import EntryForm from "../components/EntryForm";

export default function NewEntryPage() {
  const { id } = useParams();
  const { entries, loading, add, update } = useEntries();
  const navigate = useNavigate();

  const existing = id ? entries.find((e) => e.id === id) : null;

  if (id && loading) return <div className="page"><p className="empty-state">Loading...</p></div>;
  if (id && !existing) return <div className="page"><p className="empty-state">Entry not found.</p></div>;

  const handleSubmit = async (data) => {
    if (id) {
      await update(id, data);
    } else {
      await add(data);
    }
    navigate("/entries");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>{id ? "Edit Entry" : "New Entry"}</h2>
      </div>
      <EntryForm
        initialData={existing}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/entries")}
      />
    </div>
  );
}
