import express from 'express'
const app = express()
import "dotenv/config";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectDB } from './lib/db.js'

const PORT = process.env.PORT

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json())
app.use(cookieParser())

// Ensure API responses are never cached by browsers or intermediate proxies (like the Vercel rewrite)
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

import authRoutes from './routes/authRoutes.js'
app.use("/api/auth", authRoutes)
import userRoutes from './routes/userRoutes.js'
app.use("/api/users", userRoutes)
import chatRoutes from './routes/chatRoutes.js'
app.use("/api/chat", chatRoutes)
import queueRoutes from './routes/queueRoutes.js'
app.use("/api/queue", queueRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});