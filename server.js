import express from "express";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { fileURLToPath } from "url";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3e3;
app.use(express.json());
let firebaseConfig = {};
try {
  const raw = fs.readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf-8");
  firebaseConfig = JSON.parse(raw);
} catch (e) {
  console.warn("Could not read firebase-applet-config.json:", e);
}
const adminApp = getApps().length === 0 ? initializeApp({
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || "gen-lang-client-0085528767"
}) : getApps()[0];
const adminAuth = getAuth(adminApp);
const activeSessions = /* @__PURE__ */ new Map();
function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    let [name, ...rest] = cookie.split("=");
    name = name?.trim();
    if (!name) return;
    const value = rest.join("=").trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}
const ADMIN_PHONE = "0243324183";
const ADMIN_PASSWORD = "yaw";
const DESIGNATED_ADMIN_EMAIL = "10362581@upsamail.edu.gh";
const SERVER_CMS_SECRET = "ankobeng_cms_admin_vault_2026_yaw_motors_0243324183_7f9b8c2d1e0a4f5b";
function normalizePhoneNumber(rawPhone) {
  if (typeof rawPhone !== "string") return "";
  let digits = rawPhone.trim().replace(/[^0-9]/g, "");
  if (digits.startsWith("233")) {
    digits = "0" + digits.slice(3);
  }
  return digits;
}
async function generateFirebaseAdminCustomToken() {
  try {
    const customToken = await adminAuth.createCustomToken("admin-yaw-uid", {
      email: DESIGNATED_ADMIN_EMAIL
    });
    return customToken;
  } catch (err) {
    console.error("Error generating custom token:", err);
    return null;
  }
}
app.post("/api/admin/login", (req, res) => {
  const { phone, password } = req.body || {};
  const cleanPhone = normalizePhoneNumber(phone);
  const cleanPassword = typeof password === "string" ? password : "";
  if (cleanPhone === ADMIN_PHONE && cleanPassword === ADMIN_PASSWORD) {
    const sessionId = crypto.randomBytes(32).toString("hex");
    activeSessions.set(sessionId, {
      phone: ADMIN_PHONE,
      createdAt: Date.now()
    });
    res.cookie("admin_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 3600 * 1e3
      // 7 days
    });
    return res.json({
      success: true,
      message: "Authenticated successfully",
      sessionId
    });
  }
  return res.status(401).json({
    success: false,
    message: "Invalid phone number or password."
  });
});
app.get("/api/admin/session", (req, res) => {
  const cookies = parseCookies(req);
  const sessionId = cookies["admin_session_id"] || req.headers["x-admin-session-id"];
  if (sessionId && activeSessions.has(sessionId)) {
    const session = activeSessions.get(sessionId);
    return res.json({
      authenticated: true,
      user: { phone: session.phone }
    });
  }
  return res.json({ authenticated: false });
});
app.post("/api/admin/logout", (req, res) => {
  const cookies = parseCookies(req);
  const sessionId = cookies["admin_session_id"] || req.headers["x-admin-session-id"];
  if (sessionId) {
    activeSessions.delete(sessionId);
  }
  res.clearCookie("admin_session_id");
  return res.json({ success: true });
});
function toFirestoreFields(obj) {
  if (obj === null || obj === void 0) return { nullValue: null };
  if (obj instanceof Date) return { timestampValue: obj.toISOString() };
  if (typeof obj === "boolean") return { booleanValue: obj };
  if (typeof obj === "number") {
    return Number.isInteger(obj) ? { integerValue: String(obj) } : { doubleValue: obj };
  }
  if (typeof obj === "string") return { stringValue: obj };
  if (Array.isArray(obj)) {
    return { arrayValue: { values: obj.map(toFirestoreFields) } };
  }
  if (typeof obj === "object") {
    const fields = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== void 0) {
        fields[key] = toFirestoreFields(val);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(obj) };
}
app.post("/api/admin/firestore", async (req, res) => {
  const cookies = parseCookies(req);
  const sessionId = cookies["admin_session_id"] || req.headers["x-admin-session-id"];
  if (!sessionId || !activeSessions.has(sessionId)) {
    return res.status(401).json({ success: false, error: "Unauthorized admin session" });
  }
  const { action, collection: colName, docId, data } = req.body || {};
  if (!colName || !docId) {
    return res.status(400).json({ success: false, error: "Missing collection or docId" });
  }
  try {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || "gen-lang-client-0085528767";
    const dbId = process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || "ai-studio-ankobengmotors-976db35e-ddb2-4c5f-90bb-8aaacab557e3";
    const apiKey = process.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey;
    const docUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/${colName}/${docId}?key=${apiKey}`;
    if (action === "set") {
      const payloadWithAuth = {
        ...data || {},
        _cmsAuth: {
          adminPhone: ADMIN_PHONE,
          secret: SERVER_CMS_SECRET,
          timestamp: /* @__PURE__ */ new Date()
        }
      };
      const fields = toFirestoreFields(payloadWithAuth).mapValue?.fields || {};
      const restRes = await fetch(docUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields })
      });
      if (!restRes.ok) {
        const errText = await restRes.text();
        throw new Error(`Firestore REST PATCH failed: ${restRes.status} ${errText}`);
      }
      return res.json({ success: true });
    } else if (action === "delete") {
      const authPrepPayload = {
        _pendingDelete: true,
        _deleteTimestamp: /* @__PURE__ */ new Date(),
        _cmsAuth: {
          adminPhone: ADMIN_PHONE,
          secret: SERVER_CMS_SECRET,
          timestamp: /* @__PURE__ */ new Date()
        }
      };
      const prepFields = toFirestoreFields(authPrepPayload).mapValue?.fields || {};
      const prepRes = await fetch(docUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: prepFields })
      });
      if (!prepRes.ok) {
        const errText = await prepRes.text();
        throw new Error(`Firestore REST DELETE authorization failed: ${prepRes.status} ${errText}`);
      }
      const restRes = await fetch(docUrl, { method: "DELETE" });
      if (!restRes.ok && restRes.status !== 404) {
        const errText = await restRes.text();
        throw new Error(`Firestore REST DELETE failed: ${restRes.status} ${errText}`);
      }
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: "Invalid action" });
    }
  } catch (err) {
    console.error("Server firestore mutation error:", err);
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
});
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa"
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`Ankobeng Motors CMS Server running on http://localhost:${PORT}`);
});
