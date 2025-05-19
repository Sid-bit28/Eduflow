'use server';

import { connectDB } from '@/config/connectDB';
import { authOptions } from '@/lib/authOptions';
import AnswerModel from '@/models/Answer.Model';
import QuestionModel from '@/models/Question.Model';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const createAnswer = async params => {
  try {
    console.log(params);
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized User.',
      };
    }

    const author = session?.user?.id;

    const { content, question, path } = params;

    if (!content || !question) {
      return {
        success: false,
        error: 'Content and Question is required.',
      };
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
    return {
      success: true,
      message: 'Answer created successfully',
      answer: JSON.parse(JSON.stringify(answer)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Failed to create answer.',
    };
  }
};

const getAnswers = async params => {
  try {
    const { questionId } = params;

    if (!questionId) {
      return {
        status: false,
        error: 'questionId is required.',
      };
    }

    await connectDB();

    const answers = await AnswerModel.find({ question: questionId })
      .populate('author', '_id name picture')
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: 'Answer fetched successfully.',
      answers: JSON.parse(JSON.stringify(answers)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch answers.',
    };
  }
};

export { createAnswer, getAnswers };
