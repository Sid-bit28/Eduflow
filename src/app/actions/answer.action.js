'use server';

import { connectDB } from '@/config/connectDB';
import { authOptions } from '@/lib/authOptions';
import AnswerModel from '@/models/Answer.Model';
import InteractionModel from '@/models/Interaction.Model';
import QuestionModel from '@/models/Question.Model';
import UserModel from '@/models/User.Model';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const createAnswer = async params => {
  try {
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
    const questionObject = await QuestionModel.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    // TODO: Add interactions
    await InteractionModel.create({
      user: author,
      action: 'answer',
      question,
      answer: new answer._id(),
      tags: questionObject.tags,
    });

    await UserModel.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

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
    const { questionId, page = 1, pageSize = 5 } = params;
    const skipAmount = (page - 1) * pageSize;

    if (!questionId) {
      return {
        success: false,
        error: 'questionId is required.',
      };
    }

    await connectDB();

    const answers = await AnswerModel.find({ question: questionId })
      .populate('author', '_id name picture')
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);
    const totalAnswers = await AnswerModel.countDocuments({
      question: questionId,
    });
    const isNext = totalAnswers > skipAmount + answers.length;

    return {
      success: true,
      message: 'Answer fetched successfully.',
      isNext,
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

const upvoteAnswer = async params => {
  try {
    await connectDB();

    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;

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

    const answer = await AnswerModel.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      return {
        success: false,
        error: 'Answer not found.',
      };
    }

    await UserModel.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpvoted ? -2 : 2 },
    });

    await UserModel.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasUpvoted ? -10 : 10 },
    });

    revalidatePath(path);
    return {
      success: true,
      message: 'Answer Upvoted Successfully.',
    };

    // Increment author's reputation
  } catch (error) {
    return {
      success: false,
      error: 'Error upvoting answer.',
    };
  }
};

const downvoteAnswer = async params => {
  try {
    await connectDB();

    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;

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

    const answer = await AnswerModel.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      return {
        success: false,
        error: 'Answer not found.',
      };
    }

    // Increment author's reputation
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownvoted ? -2 : 2 },
    });

    await UserModel.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 },
    });

    revalidatePath(path);
    return {
      success: true,
      message: 'Answer Downvoted Successfully.',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error downvoting answer.',
    };
  }
};

const deleteAnswer = async params => {
  try {
    await connectDB();

    const { answerId, path } = params;
    if (!answerId) {
      return {
        success: false,
        error: 'answerId is required.',
      };
    }

    const answer = await AnswerModel.findById(answerId);
    if (!answer) {
      return {
        success: false,
        error: 'Answer not found.',
      };
    }

    await AnswerModel.deleteOne({ _id: answerId });
    await QuestionModel.updateMany(
      { _id: answer.question },
      { $pull: { answer: answerId } }
    );
    await InteractionModel.deleteMany({ answer: answerId });

    revalidatePath(path);
    return {
      success: true,
      message: 'Answer deleted successfully.',
    };
  } catch (error) {
    console.log(error);
    throw new Error('Unable to delete answer.');
  }
};

export { createAnswer, getAnswers, upvoteAnswer, downvoteAnswer, deleteAnswer };
