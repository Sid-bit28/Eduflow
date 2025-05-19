import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        {
          error: 'Token is required.',
        },
        {
          status: 400,
        }
      );
    }

    const verifyToken = await jwt.verify(
      token,
      process.env.FORGOT_PASSWORD_SECRET
    );

    if (!verifyToken) {
      return NextResponse.json(
        {
          error: 'Token is expired.',
          expired: true,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        error: 'Token is valid.',
        userId: verifyToken?.id,
        expired: false,
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
