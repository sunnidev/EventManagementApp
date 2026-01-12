"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.loginWithGoogle = exports.loginWithEmail = exports.signUpWithEmail = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Logger_1 = require("../utils/Logger");
const google_auth_library_1 = require("google-auth-library");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Sign Up with Email
const signUpWithEmail = async (data) => {
    const { email, password, name, location } = data;
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            location: location || undefined
        }
    });
    Logger_1.logger.info(`User created as user: ${user.id}`);
    return {
        accessToken: generateAccessToken(user.id),
        refreshToken: generateRefreshToken(user.id),
        isOrganizer: false
    };
};
exports.signUpWithEmail = signUpWithEmail;
// Login With Email
const loginWithEmail = async (data) => {
    const user = await prisma.user.findUnique({
        where: { email: data?.email },
        include: { _count: { select: { groupsCreated: true } } }
    });
    if (!user || !user.password || !(await bcryptjs_1.default.compare(data.password, user.password))) {
        throw new Error("Invalid Credientails");
    }
    const isOrganizer = (user._count.groupsCreated ?? 0) > 0;
    Logger_1.logger.info(`User logged in as ${isOrganizer ? 'organizer' : 'user'}: ${user.id}`);
    return {
        accessToken: generateAccessToken(user.id),
        refreshToken: generateRefreshToken(user.id),
        isOrganizer: false
    };
};
exports.loginWithEmail = loginWithEmail;
// Sign In with Google
const loginWithGoogle = async (idToken) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload)
        throw new Error("Invalid Google Token");
    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                profilePic: payload.picture
            }
        });
    }
    Logger_1.logger.info(`Google Login ${user.id}`);
    return {
        user,
        accessToken: generateAccessToken(user.id),
        refreshToken: generateRefreshToken(user.id),
        isOrganizer: false
    };
};
exports.loginWithGoogle = loginWithGoogle;
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};
const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
    }
    catch (error) {
        throw new Error("Invalid refresh token");
    }
};
exports.refreshAccessToken = refreshAccessToken;
