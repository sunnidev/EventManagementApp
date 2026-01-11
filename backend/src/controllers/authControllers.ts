import { PrismaClient } from "@prisma/client";
import { z, ZodError } from 'zod'
import { Request, Response } from 'express'
import { logger } from "../utils/Logger";
import { loginWithGoogle, refreshAccessToken, signUpWithEmail } from "../services/authService";

const prisma = new PrismaClient()

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 character"),
    location: z.string().optional()
})

export const signup = async (req: Request, res: Response) => {
    try {
        const validateData = signupSchema.parse(req.body)

        const { accessToken, refreshToken, isOrganizer } = await signUpWithEmail(validateData)

        const user = await prisma.user.findUnique({
            where: { email: validateData.email },
            select: { id: true, email: true, location: true, name: true }
        })
        res.status(201).json({ accessToken, refreshToken, isOrganizer, user })

    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: 'Validation Error', errors: error })
        }
        logger.error("Signup Error", error)
        res.status(400).json({ message: error.message })
    }
}

const loginSchema = z.object({
    email: z.string().email('Invalid Email Fromat'),
    password: z.string().min(8, 'Password must be at least 8 character')
})

export const login = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: error.message })
        }
        logger.error("Login Error", error)
        res.status(400).json({ message: error.message })
    }
}

export const googleLoginController = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;
        const { accessToken, refreshToken, user } = await loginWithGoogle(idToken);
        res.json({ accessToken, refreshToken, user })
    } catch (error: any) {
        logger.error("Google login error", error)
        res.status(401).json({ message: error.message })
    }
}

export const refresh = async (req: Request, res: Response) => {
    try {
        const {refreshToken} = req.body;
        const accessToken = await refreshAccessToken(refreshToken)
        res.json({accessToken})
    } catch (error: any) {
        logger.error('Refresh Error', error)
        res.status(401).json({ message: error.message })
    }
}