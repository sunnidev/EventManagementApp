import app from './app'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

const PORT = process.env.PORT || 3000;

async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay: number = 1000
): Promise<T> {
    let attempt = 0;
    while (attempt < retries) {
        try {
            return await fn();
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2010') {
                attempt++;
                console.warn(`Retry ${attempt}/${retries} after timeout`, error);
                await new Promise((res) => setTimeout(res, delay * attempt));
            } else {
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

        const server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

        server.on("error", (err) => console.error('Server error', err));
    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}

StartServer();

process.on("SIGTERM", async()) => {
    await prisma.$disconnect();
    process.exit(0)
}