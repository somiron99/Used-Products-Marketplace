import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await dbConnect();

    const chats = await Chat.find({
      participants: user._id,
    })
      .populate('participants', 'name avatar')
      .populate('product', 'title images price')
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      chats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { productId, sellerId } = await req.json();

    if (!productId || !sellerId) {
      return NextResponse.json(
        { error: 'Product ID and Seller ID are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [user._id, sellerId] },
      product: productId,
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [user._id, sellerId],
        product: productId,
        messages: [],
      });
    }

    await chat.populate('participants', 'name avatar');
    await chat.populate('product', 'title images price');

    return NextResponse.json(
      {
        success: true,
        chat,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

