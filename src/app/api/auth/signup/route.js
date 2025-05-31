import { connectDB } from '@/config/connectDB';
import UserModel from '@/models/User.Model';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: 'Email, name and password is required.',
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        {
          error: 'User already exists. Login instead.',
        },
        {
          status: 400,
        }
      );
    }

    const user = await UserModel.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      {
        message: 'User created successfully.',
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Failed to register user.',
      },
      {
        status: 500,
      }
    );
  }
}
