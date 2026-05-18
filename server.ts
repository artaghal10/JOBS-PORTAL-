import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

dotenv.config();

// Initialize Firebase Admin lazily
let firebaseConfig: any = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (firebaseConfig.projectId) {
      // Force set project ID in environment to help client libraries
      process.env.GOOGLE_CLOUD_PROJECT = firebaseConfig.projectId;
      process.env.GCLOUD_PROJECT = firebaseConfig.projectId;
    }
  }
} catch (e) {
  console.error("Failed to load firebase-applet-config.json:", e);
}

let _db: any = null;

function getDb() {
  if (!_db) {
    if (!firebaseConfig) {
      console.error("[FIREBASE] No firebase-applet-config.json found!");
      throw new Error("Firebase configuration missing. Please run Firebase setup.");
    }
    try {
      const apps = getApps();
      const targetProjectId = firebaseConfig.projectId;
      let appInstance = apps.find(a => a.options.projectId === targetProjectId);
      
      if (!appInstance) {
        console.log(`[FIREBASE] Initializing dedicated app instance for project: ${targetProjectId}`);
        appInstance = initializeApp({
          projectId: targetProjectId
        }, `App-${targetProjectId}`);
      } else {
        console.log(`[FIREBASE] Using existing app instance for project: ${appInstance.options.projectId}`);
      }
      
      const dbId = firebaseConfig.firestoreDatabaseId || firebaseConfig.databaseId || "(default)";
      console.log(`[FIREBASE] Requesting Firestore for project [${targetProjectId}] database [${dbId}]`);
      
      if (dbId && dbId !== "(default)") {
        _db = getFirestore(appInstance, dbId);
      } else {
        _db = getFirestore(appInstance);
      }
      
      // Verification log (if settings available)
      if (_db) {
        console.log("[FIREBASE] Firestore client initialized successfully.");
      }
    } catch (error) {
      console.error("Firebase Admin Initialization Error:", error);
      throw error;
    }
  }
  return _db;
}

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET || "artaghal_default_secret";

// Upload Setup
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format. Only JPG, PNG, and PDF accepted.") as any, false);
    }
  }
});

app.use(express.json());

// Admin Auth Middleware
const authenticateAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access Denied. Protocol signature missing." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid Protocol Signature." });
  }
};

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { userId, password } = req.body;
  
  // Use env variables with explicit fallback to match .env.example
  const expectedUser = (process.env.ADMIN_USER_ID || "JobUstad").trim();
  const expectedPass = (process.env.ADMIN_PASSWORD || "Pass@123").trim();

  const inputUser = (userId || "").trim();
  const inputPass = (password || "").trim();

  console.log(`[AUTH] Login attempt for ID: "${inputUser}"`);

  // Allow both the configured credentials AND the specific ones requested by the user
  const isAuthorized = 
    (inputUser === expectedUser && inputPass === expectedPass) ||
    (inputUser === "JobUstad" && inputPass === "Pass@123");

  if (isAuthorized) {
    const token = jwt.sign({ userId: inputUser }, JWT_SECRET, { expiresIn: "24h" });
    console.log(`[AUTH] Login SUCCESS for ID: ${inputUser}`);
    res.json({ token, message: "Authorized. Access granted to Command Center." });
  } else {
    console.warn(`[AUTH] Login FAILED for ID: ${inputUser}.`);
    res.status(401).json({ error: "Invalid Credentials. Access Denied." });
  }
});

// File Upload Route
app.post("/api/admin/upload", authenticateAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File upload failed or invalid format." });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

// Admin Job CRUD (Server-side for security)
app.get("/api/admin/jobs", authenticateAdmin, async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection("jobs").orderBy("createdAt", "desc").get();
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/jobs", authenticateAdmin, async (req, res) => {
  try {
    const db = getDb();
    console.log(`[JOBS] Posting new job: ${req.body.title} inside category: ${req.body.category}`);
    const jobData = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    const docRef = await db.collection("jobs").add(jobData);
    console.log(`[JOBS] Success. Document ID: ${docRef.id}`);
    res.json({ id: docRef.id, message: "Job Published Successfully." });
  } catch (error: any) {
    console.error("[JOBS] POST Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/jobs/:id", authenticateAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    await db.collection("jobs").doc(id).update({
      ...req.body,
      updatedAt: FieldValue.serverTimestamp()
    });
    res.json({ message: "Job Updated Successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/jobs/:id", authenticateAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    await db.collection("jobs").doc(id).delete();
    res.json({ message: "Job Deleted Successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize Gemini
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = ai.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "You are JobUstad Pakistan's official recruitment assistant. You help candidates find jobs, scholarships, and guide employers. Use a professional, helpful, and friendly tone. Official WhatsApp: +92 330 6105115. Email: oservices94@gmail.com. CEO: Tariq Nawaz. Manager: Hikmat Ullah. Headquarters: Serai Naurang, Lakki Marwat. Branch: Islamabad."
});

// AI Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello!" }]
        },
        {
          role: "model",
          parts: [{ text: "Hello! Specifically, I am the JobUstad Jobs AI Assistant. How can I facilitate your career path today?" }]
        },
        ...history
      ]
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI Protocol Interrupted. Please retry." });
  }
});

// Static files for uploads
app.use("/uploads", express.static(uploadDir));

async function startServer() {
  console.log("Starting JobUstad Server Initialization...");
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("Mounting Vite Development Middleware...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`>>> JobUstad Server Online at http://localhost:${PORT}`);
      console.log(`>>> Upload Directory: ${uploadDir}`);
    });
  } catch (error) {
    console.error("CRITICAL SERVER STARTUP FAILURE:", error);
    process.exit(1);
  }
}

startServer();
