"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    // Retrieve the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
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
};
exports.verifyToken = verifyToken;
