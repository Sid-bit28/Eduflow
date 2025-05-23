'use server';

import { connectDB } from '@/config/connectDB';
import { authOptions } from '@/lib/authOptions';
import QuestionModel from '@/models/Question.Model';
import TagModel from '@/models/Tag.Model';
import UserModel from '@/models/User.Model';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const getQuestions = async params => {
  try {
    await connectDB();

    const questions = await QuestionModel.find({})
      .populate({
        path: 'tags',
        model: TagModel,
      })
      .populate({ path: 'author', model: UserModel })
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: 'Fetched all question successfully.',
      questions: JSON.parse(JSON.stringify(questions)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch all questions.',
    };
  }
};

const createQuestion = async params => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        error: 'User Unauthorized',
      };
    }

    const author = session?.user?.id;

    const { title, content, tags, path } = params;

    const question = await QuestionModel.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

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

    // Using this I am using SSR to revalidate the path which is actually much faster then 'use client' + useEffect to fetch the data client side.
    revalidatePath(path);
    return {
      success: true,
      message: 'Question created successfully.',
      question: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Internal Server Error',
    };
  }
};

const getQuestionById = async params => {
  try {
    const { questionId } = params;

    if (!questionId) {
      return {
        success: false,
        error: 'questionId is required.',
      };
    }

    await connectDB();
    const question = await QuestionModel.findById(questionId)
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
      return {
        success: false,
        error: 'Question not found.',
      };
    }
    return {
      success: true,
      message: 'Question fetched successfully.',
      question: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch question.',
    };
  }
};

const upvoteQuestion = async params => {
  try {
    await connectDB();

    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

    let updateQuery = {};

    if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await QuestionModel.findByIdAndUpdate(
      questionId,
      updateQuery,
      { new: true }
    );

    if (!question) {
      return {
        success: false,
        error: 'Question not found.',
      };
    }

    revalidatePath(path);
    return {
      success: true,
      message: 'Question Upvoted Successfully.',
    };

    // Increment author's reputation
  } catch (error) {
    return {
      success: false,
      error: 'Error upvoting question.',
    };
  }
};

const downvoteQuestion = async params => {
  try {
    await connectDB();

    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

    let updateQuery = {};

    if (hasDownvoted) {
      updateQuery = { $pull: { downvote: userId } };
    } else if (hasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await QuestionModel.findByIdAndUpdate(
      questionId,
      updateQuery,
      { new: true }
    );

    if (!question) {
      return {
        success: false,
        error: 'Question not found.',
      };
    }

    // Increment author's reputation
    revalidatePath(path);
    return {
      success: true,
      message: 'Question Downvoted Successfully.',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error downvoting question.',
    };
  }
};

export {
  createQuestion,
  getQuestions,
  getQuestionById,
  upvoteQuestion,
  downvoteQuestion,
};
