import { connectDB } from '@/config/connectDB';
import UserModel from '@/models/User.Model';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    // const {
    //   page = 1,
    //   pageSize = 20,
    //   filter,
    //   searchQuery,
    // } = await request.json();

    const users = await UserModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      {
        message: 'Users fetched successfully.',
        users,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Failed to fetch users.',
      },
      {
        status: 500,
      }
    );
  }
}
