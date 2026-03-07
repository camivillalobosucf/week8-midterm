import {
  collection, doc, addDoc, deleteDoc,
  query, orderBy, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

function diaryColRef(uid) {
  return collection(db, "users", uid, "diary");
}

export function subscribeToDiary(uid, onData, onError) {
  const q = query(diaryColRef(uid), orderBy("createdAt", "asc"));
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export async function addDiaryEntry(uid, { content, date, tags }) {
  await addDoc(diaryColRef(uid), {
    content,
    date,
    tags: tags ?? [],
    createdAt: serverTimestamp(),
  });
}

export async function deleteDiaryEntry(uid, entryId) {
  await deleteDoc(doc(db, "users", uid, "diary", entryId));
}
