import { connectDB } from '@/config/connectDB';
import { authOptions } from '@/lib/authOptions';
import QuestionModel from '@/models/Question.Model';
import TagModel from '@/models/Tag.Model';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }
    const author = session?.user?.id;

    const { title, content, tags } = await request.json();
    console.log(title, content, tags);

    if (!title || !content || !tags) {
      return NextResponse.json(
        {
          error: 'Title, content, tags is required.',
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const question = await QuestionModel.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exists in the database

    for (const tag of tags) {
      const existingTag = await TagModel.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, 'i') },
        },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await QuestionModel.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    return NextResponse.json(
      {
        message: 'Question created successfully.',
        question,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Failed to create question.',
      },
      {
        status: 500,
      }
    );
  }
}
