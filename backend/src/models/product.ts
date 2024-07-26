import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a Product document
interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  location: string;
  shippingType: 'free' | 'priced';
  shippingPrice?: number; // Optional if shippingType is 'free'
  image?: string; // Make image optional if not provided
}

// Create a Schema for the Product model
const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  shippingType: { type: String, enum: ['free', 'priced'], required: true },
  shippingPrice: { type: Number, default: null },
  image: { type: String, default: null } // Make image optional
}, {
  timestamps: true // Optional: Adds createdAt and updatedAt fields
});

// Create and export the Product model
const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
