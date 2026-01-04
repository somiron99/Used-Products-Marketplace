'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Send, User, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

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
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    checkAuth();
    fetchChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [params?.id]);

  useEffect(() => {
    if (user && params?.id) {
      initializeSocket();
    }
  }, [user, params?.id]);

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
    if (!params?.id) return;
    
    try {
      // Fetch chat details first
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

      // Fetch messages
      const res = await fetch(`/api/chat/${params.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages || []);
        }
      }
    } catch (error) {
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const initializeSocket = () => {
    if (socketRef.current?.connected) {
      return; // Already connected
    }

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const newSocket = io(apiUrl, {
      transports: ['websocket', 'polling'],
      path: '/api/socket',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      if (params?.id) {
        newSocket.emit('join-chat', params.id);
      }
    });

    newSocket.on('new-message', (message: Message) => {
      setMessages((prev) => {
        // Check if message already exists (prevent duplicates)
        const exists = prev.some((m) => 
          m._id === message._id || 
          (typeof m.sender === 'object' && typeof message.sender === 'object' &&
           m.sender._id === message.sender._id &&
           m.content === message.content &&
           new Date(m.timestamp).getTime() === new Date(message.timestamp).getTime())
        );
        if (exists) return prev;
        return [...prev, message];
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistic update
    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      sender: {
        _id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      content: messageContent,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    if (!params?.id) return;

    try {
      const res = await fetch(`/api/chat/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      });

      const data = await res.json();
      if (data.success) {
        // Remove temp message and add real one
        setMessages((prev) => {
          const filtered = prev.filter((m) => m._id !== tempMessage._id);
          return [...filtered, data.message];
        });
      } else {
        // Remove temp message on error
        setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
        toast.error(data.error || 'Failed to send message');
        setNewMessage(messageContent);
      }
    } catch (error) {
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
      toast.error('Failed to send message');
      setNewMessage(messageContent);
    } finally {
      setSending(false);
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

  const formatMessageTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM d, HH:mm');
    }
  };

  const shouldShowDateSeparator = (currentMsg: Message, prevMsg: Message | null) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.timestamp);
    const prevDate = new Date(prevMsg.timestamp);
    return currentDate.toDateString() !== prevDate.toDateString();
  };

  const formatDateSeparator = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
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
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Chat not found</p>
          <Link
            href="/chat"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700"
          >
            Back to messages
          </Link>
        </div>
      </div>
    );
  }

  const otherUser = getOtherParticipant();

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center space-x-4 bg-white sticky top-0 z-10">
          <Link 
            href="/chat" 
            className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold text-gray-900 truncate">{otherUser?.name || 'Unknown'}</h2>
              {connected && (
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Connected" />
              )}
            </div>
            <Link
              href={`/products/${chat.product._id}`}
              className="text-sm text-gray-500 hover:text-primary-600 truncate block"
            >
              {chat.product.title}
            </Link>
          </div>
          {chat.product.images && chat.product.images.length > 0 && (
            <Link
              href={`/products/${chat.product._id}`}
              className="w-12 h-12 md:w-16 md:h-16 relative rounded-lg overflow-hidden flex-shrink-0 border border-gray-200"
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, idx) => {
              const myMessage = isMyMessage(message);
              const sender = typeof message.sender === 'object' ? message.sender : null;
              const prevMessage = idx > 0 ? messages[idx - 1] : null;
              const showDateSeparator = shouldShowDateSeparator(message, prevMessage);
              const isTemp = message._id?.toString().startsWith('temp-');

              return (
                <div key={message._id || idx}>
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {formatDateSeparator(message.timestamp)}
                      </div>
                    </div>
                  )}
                  <div className={`flex ${myMessage ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
                    {!myMessage && (
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        {sender?.avatar ? (
                          <Image
                            src={sender.avatar}
                            alt={sender.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <User className="w-4 h-4 text-primary-600" />
                        )}
                      </div>
                    )}
                    <div className={`max-w-xs lg:max-w-md ${myMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!myMessage && sender && (
                        <span className="text-xs text-gray-500 mb-1 px-1">{sender.name}</span>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          myMessage
                            ? 'bg-primary-600 text-white rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                        } ${isTemp ? 'opacity-70' : ''}`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                        <div className={`flex items-center space-x-1 mt-1.5 ${myMessage ? 'justify-end' : 'justify-start'}`}>
                          <span
                            className={`text-xs ${
                              myMessage ? 'text-primary-100' : 'text-gray-500'
                            }`}
                          >
                            {formatMessageTime(message.timestamp)}
                          </span>
                          {myMessage && !isTemp && (
                            <CheckCircle2 className="w-3 h-3 text-primary-200" />
                          )}
                          {isTemp && (
                            <Clock className="w-3 h-3 text-primary-200 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                    {myMessage && (
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <User className="w-4 h-4 text-primary-600" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
