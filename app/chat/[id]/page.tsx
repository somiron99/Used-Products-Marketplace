'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Send, User, ArrowLeft } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Message {
  _id?: string;
  sender: string | { _id: string; name: string; avatar?: string };
  content: string;
  timestamp: string | Date;
}

interface Chat {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    avatar?: string;
  }>;
  product: {
    _id: string;
    title: string;
    images: string[];
    price: number;
  };
  messages: Message[];
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
    fetchChat();
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        toast.error('Please login to access chat');
      } else {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchChat = async () => {
    try {
      const res = await fetch(`/api/chat/${params.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages || []);
        }
      }

      // Fetch chat details
      const chatRes = await fetch('/api/chat');
      if (chatRes.ok) {
        const chatData = await chatRes.json();
        if (chatData.success) {
          const foundChat = chatData.chats.find((c: Chat) => c._id === params.id);
          if (foundChat) {
            setChat(foundChat);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const initializeSocket = () => {
    // Connect to Socket.io server
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const newSocket = io(apiUrl, {
      transports: ['websocket', 'polling'],
      path: '/api/socket',
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      newSocket.emit('join-chat', params.id);
    });

    newSocket.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const res = await fetch(`/api/chat/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      });

      const data = await res.json();
      if (data.success) {
        const message = data.message;
        setMessages((prev) => [...prev, message]);
        
        if (socket) {
          socket.emit('send-message', {
            chatId: params.id,
            message: message,
          });
        }
      } else {
        toast.error(data.error || 'Failed to send message');
        setNewMessage(messageContent);
      }
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(messageContent);
    }
  };

  const getOtherParticipant = () => {
    if (!user || !chat) return null;
    return chat.participants.find((p) => p._id !== user.id);
  };

  const isMyMessage = (message: Message) => {
    const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
    return senderId === user?.id;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded mb-4" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Chat not found</p>
      </div>
    );
  }

  const otherUser = getOtherParticipant();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center space-x-4">
          <Link href="/chat" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            {otherUser?.avatar ? (
              <Image
                src={otherUser.avatar}
                alt={otherUser.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <User className="w-5 h-5 text-primary-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">{otherUser?.name || 'Unknown'}</h2>
            <Link
              href={`/products/${chat.product._id}`}
              className="text-sm text-gray-500 hover:text-primary-600"
            >
              {chat.product.title}
            </Link>
          </div>
          {chat.product.images && chat.product.images.length > 0 && (
            <Link
              href={`/products/${chat.product._id}`}
              className="w-16 h-16 relative rounded-lg overflow-hidden"
            >
              <Image
                src={chat.product.images[0]}
                alt={chat.product.title}
                fill
                className="object-cover"
              />
            </Link>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message, idx) => {
              const myMessage = isMyMessage(message);
              const sender = typeof message.sender === 'object' ? message.sender : null;
              
              return (
                <div
                  key={idx}
                  className={`flex ${myMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      myMessage
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        myMessage ? 'text-primary-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

