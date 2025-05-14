import { connectDB } from '@/config/connectDB';
import TagModel from '@/models/Tag.Model';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    const tags = await TagModel.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: 'Tags fetched successfully.',
        tags,
      },
      {
        status: 200,
      }
    );
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
