import EntryItem from "./EntryItem";

export default function EntryList({ entries, onDelete }) {
  if (entries.length === 0) {
    return <p className="empty-state">No entries found.</p>;
  }

  return (
    <div className="entry-list">
      {entries.map((entry) => (
        <EntryItem key={entry.id} entry={entry} onDelete={onDelete} />
      ))}
    </div>
  );
}
