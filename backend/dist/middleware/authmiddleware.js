"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }
    else {
        res.sendStatus(403); // Send 403 Forbidden if no authorization header present
    }
};
exports.default = verifyToken;
