"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.googleLoginController = exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const Logger_1 = require("../utils/Logger");
const authService_1 = require("../services/authService");
const prisma = new client_1.PrismaClient();
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(8, "Password must be at least 8 character"),
    location: zod_1.z.string().optional()
});
const signup = async (req, res) => {
    try {
        const validateData = signupSchema.parse(req.body);
        const { accessToken, refreshToken, isOrganizer } = await (0, authService_1.signUpWithEmail)(validateData);
        const user = await prisma.user.findUnique({
            where: { email: validateData.email },
            select: { id: true, email: true, location: true, name: true }
        });
        res.status(201).json({ accessToken, refreshToken, isOrganizer, user });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ message: 'Validation Error', errors: error });
        }
        Logger_1.logger.error("Signup Error", error);
        res.status(400).json({ message: error.message });
    }
};
exports.signup = signup;
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid Email Fromat'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 character')
});
const login = async (req, res) => {
    try {
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ message: error.message });
        }
        Logger_1.logger.error("Login Error", error);
        res.status(400).json({ message: error.message });
    }
};
exports.login = login;
const googleLoginController = async (req, res) => {
    try {
        const { idToken } = req.body;
        const { accessToken, refreshToken, user } = await (0, authService_1.loginWithGoogle)(idToken);
        res.json({ accessToken, refreshToken, user });
    }
    catch (error) {
        Logger_1.logger.error("Google login error", error);
        res.status(401).json({ message: error.message });
    }
};
exports.googleLoginController = googleLoginController;
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const accessToken = await (0, authService_1.refreshAccessToken)(refreshToken);
        res.json({ accessToken });
    }
    catch (error) {
        Logger_1.logger.error('Refresh Error', error);
        res.status(401).json({ message: error.message });
    }
};
exports.refresh = refresh;
