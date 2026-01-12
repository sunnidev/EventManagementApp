"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const Logger_1 = require("./utils/Logger");
const authRoutes_1 = __importDefault(require("./routes/v1/authRoutes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'To many request from this IP, please try agin later'
});
app.use("/api/vi/auth", authRoutes_1.default);
// Login Middleware
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        const status = res.statusCode;
        const success = status >= 200 && status < 300 ? 'success' : 'Errors';
        const bodyStr = typeof body === "object" ? JSON.stringify(body) : body;
        Logger_1.logger.info(`Response: ${req.method} ${req.url} - Status: ${status} (${success}) - Body: ${bodyStr.slice(0, 500)}...`);
        return originalSend.call(this, body);
    };
    next();
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
exports.default = app;
