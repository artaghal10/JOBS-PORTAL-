import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, getDoc, Timestamp, limit } from "firebase/firestore";
// @ts-ignore
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  category: "Government" | "Private" | "Overseas" | "Scholarship" | "Newspaper";
  deadline: string;
  whatsapp: string;
  imageUrl?: string;
  featured?: boolean;
  createdAt: any;
}

export async function getJobsByCategory(category: string) {
  try {
    const q = query(
      collection(db, "jobs"),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Job[];
  } catch (e: any) {
    console.error("Error fetching jobs by category:", e);
    // Fallback if index is missing
    if (e.message && e.message.includes("index")) {
      const qFallback = query(
        collection(db, "jobs"),
        where("category", "==", category)
      );
      const snapshot = await getDocs(qFallback);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Job))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }
    return [];
  }
}

export async function getLatestJobs(limitCount: number = 6) {
  try {
    const q = query(
      collection(db, "jobs"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Job[];
  } catch (e: any) {
    console.error("Error fetching latest jobs:", e);
    // Fallback if index is missing
    const qFallback = query(collection(db, "jobs"), limit(limitCount * 2));
    const snapshot = await getDocs(qFallback);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Job))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, limitCount);
  }
}

export async function addJob(job: Omit<Job, "id" | "createdAt">) {
  return addDoc(collection(db, "jobs"), {
    ...job,
    createdAt: Timestamp.now()
  });
}
