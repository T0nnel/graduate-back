"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("../models/User")); // Ensure this path is correct
const product_1 = __importDefault(require("../models/product")); // Adjust path as necessary
const router = express_1.default.Router();
router.use((0, cors_1.default)());
router.use(body_parser_1.default.json());
// User Registration
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        let user = await User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        user = new User_1.default({ firstName, lastName, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            userData: {
                id: user._id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}` // Provide full name
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the folder to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // Append timestamp to filename
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Route to add a product
router.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, location, shippingType, shippingPrice } = req.body;
        // Create a new product
        const newProduct = new product_1.default({
            name,
            description,
            price,
            location,
            shippingType,
            shippingPrice: shippingType === 'priced' ? shippingPrice : undefined,
            image: req.file ? req.file.filename : null
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating product' });
    }
});
// Route to get all products
router.get('/api/products', async (req, res) => {
    try {
        const products = await product_1.default.find();
        res.json(products);
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving products' });
    }
});
// Get Products
router.get('/products', async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ error: 'Search term is required' });
        }
        const products = await product_1.default.find({
            name: new RegExp(search.toString(), 'i') // Case insensitive search
        });
        res.json({ products });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/products', async (req, res) => {
    try {
        const products = await product_1.default.find(); // Fetch all products from the database
        res.json({ products });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
