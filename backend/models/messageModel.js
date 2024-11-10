import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
    {
        finalMessages: {
            type: Object,
            required: true
        },
        userId: {
            type: ObjectId,
            required: true
        }
    }
);

export const Message = mongoose.model('Message', messageSchema)