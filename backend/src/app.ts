import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import fs, { stat } from 'fs'
import { logger } from './utils/Logger'
import authRoutes from './routes/v1/authRoutes'

const app = express()

app.use(helmet());
app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'To many request from this IP, please try agin later'
})

app.use("/api/vi/auth", authRoutes)

// Login Middleware

app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        const status = res.statusCode
        const success = status >= 200 && status < 300 ? 'success' : 'Errors'
        const bodyStr = typeof body === "object" ? JSON.stringify(body) : body;
        logger.info(
            `Response: ${req.method} ${req.url} - Status: ${status} (${success}) - Body: ${bodyStr.slice(0, 500)}...`,
        );
        return originalSend.call(this, body)
    };
    next();
})

const port = 3000

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})

export default app