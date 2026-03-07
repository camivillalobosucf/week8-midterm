import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  subscribeToEntries,
  addEntry,
  updateEntry,
  deleteEntry,
} from "../services/entriesService";

export function useEntries() {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    const unsubscribe = subscribeToEntries(
      currentUser.uid,
      (data) => {
        setEntries(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const add = (data) => addEntry(currentUser.uid, data);
  const update = (entryId, data) => updateEntry(currentUser.uid, entryId, data);
  const remove = (entryId) => deleteEntry(currentUser.uid, entryId);

  return { entries, loading, error, add, update, remove };
}
