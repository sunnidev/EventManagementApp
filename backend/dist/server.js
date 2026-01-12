"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});
const PORT = process.env.PORT || 3000;
async function withRetry(fn, retries = 3, delay = 1000) {
    let attempt = 0;
    while (attempt < retries) {
        try {
            return await fn();
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2010') {
                attempt++;
                console.warn(`Retry ${attempt}/${retries} after timeout`, error);
                await new Promise((res) => setTimeout(res, delay * attempt));
            }
            else {
                throw error;
            }
        }
    }
    throw new Error("Max retries exceeded");
}
async function StartServer() {
    try {
        await withRetry(() => prisma.$connect());
        console.log('Connected to MongoDB');
        const server = app_1.default.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
        server.on("error", (err) => console.error('Server error', err));
    }
    catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}
StartServer();
process.on("SIGTERM", async());
{
    await prisma.$disconnect();
    process.exit(0);
}
