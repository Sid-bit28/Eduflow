import { connectDB } from '@/config/connectDB';
import AnswerModel from '@/models/Answer.Model';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log('ID', id);

    if (!id) {
      return NextResponse.json(
        {
          error: 'questionId is required.',
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const answers = await AnswerModel.find({ question: id })
      .populate('author', '_id name picture')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: 'Answers fetched successfully.',
        answers,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Failed to create Answer.',
      },
      {
        status: 500,
      }
    );
  }
}
