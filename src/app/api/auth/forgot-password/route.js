import { NextResponse } from 'next/server';
import { sendEmail } from '@/config/resendEmail';
import { connectDB } from '@/config/connectDB';
import UserModel from '@/models/User.Model';
import jwt from 'jsonwebtoken';
import { ForgotPasswordEmail } from '@/components/template/ForgotPasswordEmail';

export async function POST(request) {
  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const DOMAIN = `${protocol}://${host}`;
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          error: 'Email is required.',
        },
        {
          status: '400',
        }
      );
    }

    await connectDB();
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
      return NextResponse.json(
        {
          error: 'User not found.',
        },
        {
          status: 400,
        }
      );
    }

    const payload = {
      id: userExists?._id.toString(),
    };

    var token = jwt.sign(payload, process.env.FORGOT_PASSWORD_SECRET, {
      expiresIn: 60 * 60,
    });

    const URL = `${DOMAIN}/reset-password?token=${token}`;

    // sending email

    await sendEmail(
      userExists.email,
      'Forgot password from EduFlow 🫡',
      ForgotPasswordEmail({ name: userExists.name, url: URL })
    );

    return NextResponse.json(
      {
        message: 'Check your email.',
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
