import { connectDB } from '@/config/connectDB';
import { authOptions } from '@/lib/authOptions';
import UserModel from '@/models/User.Model';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }
    const userId = session?.user?.id;

    await connectDB();

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found.',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Failed to fetch user.',
      },
      {
        status: 500,
      }
    );
  }
}
