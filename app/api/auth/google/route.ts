import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { error: 'No credential provided' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { error: 'Google OAuth not configured' },
        { status: 500 }
      );
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid Google token' },
        { status: 400 }
      );
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return NextResponse.json(
        { error: 'Email not provided by Google' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    // If not, check if user exists with this email
    if (!user) {
      user = await User.findOne({ email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        if (picture && !user.avatar) {
          user.avatar = picture;
        }
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          googleId,
          avatar: picture,
        });
      }
    } else {
      // Update avatar if needed
      if (picture && !user.avatar) {
        user.avatar = picture;
        await user.save();
      }
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { error: error.message || 'Google authentication failed' },
      { status: 500 }
    );
  }
}

