import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    content: string;
    image?: string;
    tags: string[];
    slug: string;
    category: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    status: 'published' | 'draft';
    views: number;
    comments: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
}

const BlogSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        image: { type: String },
        slug: { type: String, unique: true },
        tags: [{ type: String }],
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['published', 'draft'], default: 'published' },
        views: { type: Number, default: 0 },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
