import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import { getCurrentUser } from '@/lib/auth';

declare global {
  var io: any;
}

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

    // Check if user is a participant
    const isParticipant = chat.participants.some(
      (p: any) => p.toString() === user._id.toString()
    );

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Populate sender information for all messages
    await chat.populate('messages.sender', 'name avatar');

    // Convert to plain objects for JSON response
    const messages = chat.messages.map((msg: any) => ({
      _id: msg._id,
      sender: {
        _id: msg.sender._id,
        name: msg.sender.name,
        avatar: msg.sender.avatar,
      },
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    return NextResponse.json({
      success: true,
      messages: messages || [],
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

    // Check if user is a participant
    const isParticipant = chat.participants.some(
      (p: any) => p.toString() === user._id.toString()
    );

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Add message to chat
    chat.messages.push({
      sender: user._id,
      content: content.trim(),
      timestamp: new Date(),
    } as any);

    // Update last message
    chat.lastMessage = chat.messages[chat.messages.length - 1] as any;
    
    await chat.save();

    // Populate sender information
    await chat.populate('messages.sender', 'name avatar');
    await chat.populate('lastMessage.sender', 'name avatar');

    const lastMessage = chat.messages[chat.messages.length - 1];
    const sender = (lastMessage as any).sender;
    
    // Format message for response
    const formattedMessage = {
      _id: lastMessage._id,
      sender: {
        _id: sender._id || sender.toString(),
        name: sender.name || user.name,
        avatar: sender.avatar || user.avatar,
      },
      content: lastMessage.content,
      timestamp: lastMessage.timestamp,
    };
    
    // Emit message via Socket.io for real-time updates
    if (global.io) {
      global.io.to(params.id).emit('new-message', formattedMessage);
    }

    return NextResponse.json(
      {
        success: true,
        message: formattedMessage,
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

