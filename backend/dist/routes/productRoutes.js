"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Example route
router.get('/', (req, res) => {
    res.send('User route');
});
exports.default = router;
//# sourceMappingURL=productRoutes.js.map