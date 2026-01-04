import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  product: mongoose.Types.ObjectId;
  messages: IMessage[];
  lastMessage?: IMessage;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ChatSchema: Schema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    messages: [MessageSchema],
    lastMessage: MessageSchema,
  },
  {
    timestamps: true,
  }
);

ChatSchema.index({ participants: 1 });
ChatSchema.index({ product: 1 });

export default (mongoose.models.Chat as Model<IChat>) || mongoose.model<IChat>('Chat', ChatSchema);

