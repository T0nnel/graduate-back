"use strict";
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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const product_1 = __importDefault(require("./models/product")); // Corrected import path
const user_1 = __importDefault(require("./models/user")); // Corrected import path
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tonnel:tonnel@cluster0.eyeqbwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static('uploads'));
// Multer setup for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Create uploads folder if it doesn't exist
if (!fs_1.default.existsSync('uploads')) {
    fs_1.default.mkdirSync('uploads');
}
// Connect to MongoDB
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGO_URI, {});
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
});
// Connect to the database
connectToDatabase().catch(error => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the process if connection fails
});
// Routes
// POST endpoint for adding products
app.post('/api/products', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, location, shippingType, shippingPrice } = req.body;
    const image = req.file ? req.file.filename : '';
    const newProduct = new product_1.default({
        name,
        description,
        price,
        location,
        shippingType,
        shippingPrice: shippingType === 'priced' ? shippingPrice : null,
        image
    });
    try {
        const savedProduct = yield newProduct.save();
        res.status(201).json(savedProduct);
    }
    catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// GET endpoint to retrieve all products
app.get('/api/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find();
        res.json(products);
    }
    catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// GET endpoint to search products
app.get('/api/products/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    if (!search || typeof search !== 'string') {
        return res.status(400).json({ error: 'Search term is required and must be a string' });
    }
    try {
        const products = yield product_1.default.find({
            name: { $regex: new RegExp(search, 'i') }
        });
        res.json({ products });
    }
    catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Endpoint to get user info by email
app.get('/api/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const user = yield user_1.default.findOne({ email });
        if (user) {
            return res.json(user);
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
// Use the user routes
app.use('/api/users', userRoutes_1.default);
// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
