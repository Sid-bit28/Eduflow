import { connectDB } from '@/config/connectDB';
import QuestionModel from '@/models/Question.Model';
import TagModel from '@/models/Tag.Model';
import UserModel from '@/models/User.Model';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log('ID', id);
    if (!id) {
      return NextResponse.json(
        {
          error: 'Question ID is required.',
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();
    const question = await QuestionModel.findById(id)
      .populate({
        path: 'tags',
        model: TagModel,
        select: '_id name',
      })
      .populate({
        path: 'author',
        model: UserModel,
        select: '_id name picture',
      });

    if (!question) {
      return NextResponse.json(
        {
          error: 'Question not found.',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: 'Question fetched successfully.',
        question,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Question.',
      },
      {
        status: 500,
      }
    );
  }
}
