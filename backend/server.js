import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import LeaderRoutes from "./routes/LeaderRoutes.js"; // ✅ add this
import ContactsRouter from "./routes/ContactsRouter.js";
import documentRoutes from "./routes/documentRoutes.js";
import reportRoutes from  "./routes/reportRoutes.js"


dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/leader", LeaderRoutes); // ✅ add this
app.use("/api/contacts", ContactsRouter);
app.use("/api/documents", documentRoutes);
app.use("/api/reports", reportRoutes)

app.get("/", (req, res) => res.send("Bursary API running"));

app.listen(5000, () => console.log("Server running on port 5000"));
