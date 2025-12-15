import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    blog: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
}

const CommentSchema: Schema = new Schema(
    {
        content: { type: String, required: true },
        blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

export default mongoose.model<IComment>('Comment', CommentSchema);
