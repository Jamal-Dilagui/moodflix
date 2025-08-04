import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user) {
      return NextResponse.json({
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
        }
      });
    } else {
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ user: null });
  }
} 