import express from 'express'
import dotenv from 'dotenv'
import mongo from './db.js'
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";

dotenv.config();

const app=express();

// Setup CORS so React frontend can connect (assumes fronted is at localhost:5173 by default Vite config)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

mongo();

app.use("/api/auth", authRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/campaign", campaignRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server is running in the port ${PORT}`);
})