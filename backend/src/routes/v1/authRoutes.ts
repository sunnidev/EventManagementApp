import express from 'express'
import { googleLoginController, login, refresh, signup } from '../../controllers/authControllers'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/google-login", googleLoginController)
router.post("/refresh", refresh)

export default router