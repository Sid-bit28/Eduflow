import { connectDB } from '@/config/connectDB';
import { authOptions } from '@/lib/authOptions';
import AnswerModel from '@/models/Answer.Model';
import QuestionModel from '@/models/Question.Model';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: 'User Unauthorized',
        },
        {
          status: 401,
        }
      );
    }
    const author = session?.user?.id;

    const { content, question, path } = await request.json();

    if (!content || !question) {
      return NextResponse.json(
        {
          error: 'Content and questionId is required.',
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const answer = await AnswerModel.create({
      content,
      author,
      question,
    });

    // Add the answer to the question's answers array
    await QuestionModel.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    // TODO: Add interactions
    
    revalidatePath(path);
    return NextResponse.json(
      {
        message: 'Answer created successfully.',
        answer,
      },
      {
        status: 201,
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
