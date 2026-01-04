'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';

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
  lastMessage?: {
    content: string;
    timestamp: string;
  };
}

export default function ChatListPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchChats();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        toast.error('Please login to access messages');
      } else {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (data.success) {
        setChats(data.chats);
      }
    } catch (error) {
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    if (!user) return null;
    return chat.participants.find((p) => p._id !== user.id);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      {chats.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No messages yet</p>
          <p className="text-sm text-gray-400">
            Start a conversation by contacting a seller on a product page
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => {
            const otherUser = getOtherParticipant(chat);
            return (
              <Link
                key={chat._id}
                href={`/chat/${chat._id}`}
                className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    {otherUser?.avatar ? (
                      <Image
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-6 h-6 text-primary-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{otherUser?.name || 'Unknown'}</h3>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {new Date(chat.lastMessage.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {chat.product.title}
                    </p>
                    {chat.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {chat.product.images && chat.product.images.length > 0 && (
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={chat.product.images[0]}
                        alt={chat.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

