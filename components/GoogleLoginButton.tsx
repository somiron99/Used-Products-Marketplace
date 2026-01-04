'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  width?: number;
  onSuccess?: () => void;
}

export default function GoogleLoginButton({
  text = 'signin_with',
  theme = 'outline',
  size = 'large',
  width,
  onSuccess,
}: GoogleLoginButtonProps) {
  const router = useRouter();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn,
    });

    // Render the button
    const buttonDiv = document.getElementById('google-signin-button');
    if (buttonDiv) {
      window.google.accounts.id.renderButton(buttonDiv, {
        type: 'standard',
        theme: theme,
        size: size,
        text: text,
        width: width || undefined,
      });
    }
  };

  const handleGoogleSignIn = async (response: any) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login successful!');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/');
          router.refresh();
        }
      } else {
        toast.error(data.error || 'Google login failed');
      }
    } catch (error) {
      toast.error('An error occurred during Google login');
    }
  };

  return (
    <div
      id="google-signin-button"
      style={{ width: width || '100%' }}
      className="flex justify-center"
    />
  );
}

