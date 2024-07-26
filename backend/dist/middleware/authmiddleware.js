"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    // Retrieve the token from the Authorization header
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        // Verify and decode the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach userId to the request object
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: 'Authorization header missing' });
    if (!token)
        return res.status(401).json({ message: 'Token missing' });
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Invalid token' });
        req.userId = decoded.id; // Set user ID from token
        next();
    });
};
exports.verifyToken = verifyToken;
