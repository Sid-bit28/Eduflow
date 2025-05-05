import { NextResponse } from 'next/server';
import { connectDB } from '@/config/connectDB';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/User.Model';

export async function POST(request) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json(
        {
          error: 'Required userId and password.',
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: 'Password updated successfully.',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Something went wrong.',
      },
      {
        status: 500,
      }
    );
  }
}
