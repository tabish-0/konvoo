import express from 'express'
const router = express.Router()

import { login, signup, logout, onboard } from '../controllers/authContoller.js'
import { protectRoute } from '../middleware/authMiddleware.js'

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.post("/onboarding", protectRoute, onboard);

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router