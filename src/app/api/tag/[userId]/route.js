import { connectDB } from '@/config/connectDB';
import UserModel from '@/models/User.Model';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        {
          error: 'User ID is required.',
        },
        {
          status: 400,
        }
      );
    }

    const user = await UserModel.findById(userId);

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

    return NextResponse.json([
      { _id: '1', name: 'tag1' },
      { _id: '2', name: 'tag2' },
    ]);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Failed to fetch tags.',
      },
      {
        status: 500,
      }
    );
  }
}
