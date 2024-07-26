"use strict";
// routes/users.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const User_1 = __importDefault(require("../models/User")); // Assuming your User model is defined in models/User.ts
const router = express_1.default.Router();
router.use((0, cors_1.default)());
router.use(body_parser_1.default.json());
// Register route
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User_1.default({
            firstName,
            lastName,
            email,
            password
        });
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(password, salt);
        yield user.save();
        const payload = {
            user: {
                id: user.id
            }
        };
        jsonwebtoken_1.default.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.error("Error");
        res.status(500).send('Server Error');
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
}));
const products = [
    { id: 1, name: 'Gucci', description: 'Description for Product 1' },
    { id: 2, name: 'Versace', description: 'Description for Product 2' },
    { id: 3, name: 'Balenciaga', description: 'Description for Product 3' },
    // Add more products as needed
];
router.get('/api/products', (req, res) => {
    const { search } = req.query;
    if (!search) {
        return res.status(400).json({ error: 'Search term is required' });
    }
    // Simulate filtering based on search term (case insensitive)
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(search.toString().toLowerCase()));
    res.json({ products: filteredProducts });
});
// Export the router
;
exports.default = router;
