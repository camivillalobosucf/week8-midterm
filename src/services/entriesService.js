import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

function entriesRef(uid) {
  return collection(db, "users", uid, "entries");
}

function entryRef(uid, entryId) {
  return doc(db, "users", uid, "entries", entryId);
}

/**
 * Subscribe to all entries for a user, ordered by activity time descending.
 * Returns an unsubscribe function — call it on component unmount.
 */
export function subscribeToEntries(uid, onData, onError) {
  const q = query(entriesRef(uid), orderBy("timestamp", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const entries = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(entries);
    },
    onError
  );
}

function toTimestamp(val) {
  return Timestamp.fromDate(new Date(val));
}

/**
 * Add a new entry. `data.timestamp` should be a JS Date string (the time the
 * activity happened). `createdAt` is set automatically by the server.
 */
export async function addEntry(uid, data) {
  const payload = { ...data, createdAt: serverTimestamp() };
  if (payload.timestamp) payload.timestamp = toTimestamp(payload.timestamp);
  if (payload.sleepEnd) payload.sleepEnd = toTimestamp(payload.sleepEnd);
  await addDoc(entriesRef(uid), payload);
}

/**
 * Update an existing entry by its Firestore document ID.
 */
export async function updateEntry(uid, entryId, data) {
  const payload = { ...data };
  if (payload.timestamp) payload.timestamp = toTimestamp(payload.timestamp);
  if (payload.sleepEnd) payload.sleepEnd = toTimestamp(payload.sleepEnd);
  await updateDoc(entryRef(uid, entryId), payload);
}

/**
 * Permanently delete an entry.
 */
export async function deleteEntry(uid, entryId) {
  await deleteDoc(entryRef(uid, entryId));
}
