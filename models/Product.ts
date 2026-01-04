import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'like-new' | 'excellent' | 'good' | 'fair';
  images: string[];
  location: string;
  seller: mongoose.Types.ObjectId;
  status: 'active' | 'sold' | 'pending';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    condition: {
      type: String,
      enum: ['new', 'like-new', 'excellent', 'good', 'fair'],
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'pending'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ location: 1 });
ProductSchema.index({ status: 1, createdAt: -1 });

export default (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);

