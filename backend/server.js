import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Vite local development server
  credentials: true
}));
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Mounted Routes
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 CollabFlow SaaS Express Backend listening on http://localhost:${PORT}`);
  console.log(`📡 Health Check available at http://localhost:${PORT}/health`);
});
