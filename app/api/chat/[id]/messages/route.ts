import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await dbConnect();

    const chat = await Chat.findById(params.id);

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    if (!chat.participants.includes(user._id)) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      messages: chat.messages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const chat = await Chat.findById(params.id);

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    if (!chat.participants.includes(user._id)) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const message = {
      sender: user._id,
      content: content.trim(),
      timestamp: new Date(),
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    await chat.save();

    await chat.populate('messages.sender', 'name avatar');

    return NextResponse.json(
      {
        success: true,
        message: chat.messages[chat.messages.length - 1],
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

