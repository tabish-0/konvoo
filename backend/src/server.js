import express from 'express'
const app = express()
import "dotenv/config";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'

import {connectDB} from './lib/db.js'

const PORT=process.env.PORT
const __dirname = path.resolve();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);
app.use(express.json())
app.use(cookieParser())

import authRoutes from './routes/authRoutes.js'
app.use("/api/auth", authRoutes)
import userRoutes from './routes/userRoutes.js'
app.use("/api/users", userRoutes)
import chatRoutes from './routes/chatRoutes.js'
app.use("/api/chat", chatRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});