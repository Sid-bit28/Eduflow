'use server';

import { connectDB } from '@/config/connectDB';
import { authOptions } from '@/lib/authOptions';
import AnswerModel from '@/models/Answer.Model';
import QuestionModel from '@/models/Question.Model';
import TagModel from '@/models/Tag.Model';
import UserModel from '@/models/User.Model';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const getAllUsers = async params => {
  try {
    await connectDB();

    const { searchQuery, filter, page = 1, pageSize = 1 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
    }

    let sortOptions = {};

    switch (filter) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { reputation: -1 };
        break;
    }

    const users = await UserModel.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await UserModel.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;
    return {
      success: true,
      message: 'Users fetched successfully.',
      isNext,
      users: JSON.parse(JSON.stringify(users)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch all users.',
    };
  }
};

const getUserById = async params => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized User.',
      };
    }

    const userId = session?.user?.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    return {
      success: true,
      message: 'User fetched successfully.',
      user: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error fetching user.',
    };
  }
};

const toggleSaveQuestion = async params => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized User.',
      };
    }

    await connectDB();

    const { userId, questionId, path } = params;
    if (!userId || !questionId) {
      return {
        success: false,
        error: 'userId & questionId is required.',
      };
    }

    const user = await UserModel.findById(userId);

    if (!userId) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    const isQuestionSaved = user.saved.includes(questionId);
    let msg;
    if (isQuestionSaved) {
      // remove the question from the saved list
      await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
      msg = 'Question Unsaved Successfully.';
    } else {
      // add the question to the saved
      await UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
      msg = 'Question Saved Successfully.';
    }

    revalidatePath(path);
    return {
      success: true,
      message: msg,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Toggle Save Question failed.',
    };
  }
};

const getSavedQuestions = async params => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized User.',
      };
    }

    const userId = session?.user?.id;

    const { page = 1, pageSize = 10, filter, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const query = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'most_voted':
        sortOptions = { upvotes: -1 };
        break;
      case 'most_viewed':
        sortOptions = { views: 1 };
        break;
      case 'most_recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'most_answered':
        sortOptions = { answers: -1 };
        break;
    }

    await connectDB();

    const user = await UserModel.findById(userId).populate({
      path: 'saved',
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: 'tags', model: TagModel, select: '_id name' },
        { path: 'author', model: UserModel, select: '_id name picture' },
      ],
    });

    const isNext = user.saved.length > pageSize;
    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    const savedQuestions = user.saved;

    return {
      success: true,
      message: 'Fetched Saved Questions Successfully.',
      isNext,
      savedQuestions: JSON.parse(JSON.stringify(savedQuestions)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Fetching Saved Questions failed.',
    };
  }
};

const getUserInfo = async params => {
  try {
    await connectDB();

    const { userId } = params;
    if (!userId) {
      return {
        success: false,
        error: 'userId is required.',
      };
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    const totalQuestions = await QuestionModel.countDocuments({
      author: user._id,
    });

    const totalAnswers = await AnswerModel.countDocuments({ author: user._id });

    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)),
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Unable to fetch user.',
    };
  }
};

const getLoggedInUserInfo = async params => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        success: true,
        message: 'Session not found.',
      };
    }

    return {
      success: true,
      userId: session?.user?.id,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'User not logged In.',
    };
  }
};

const getUserQuestions = async params => {
  try {
    await connectDB();

    const { userId, page = 1, pageSize = 5 } = params;
    const skipAmount = (page - 1) * pageSize;
    if (!userId) {
      return {
        success: false,
        error: 'userId is required.',
      };
    }

    const totalQuestions = await QuestionModel.countDocuments({
      author: userId,
    });

    const userQuestions = await QuestionModel.find({ author: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .populate('tags', '_id name')
      .populate('author', '_id name picture')
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + userQuestions.length;

    return {
      success: true,
      message: 'User Questions fetched successfully.',
      isNext,
      totalQuestions: JSON.parse(JSON.stringify(totalQuestions)),
      questions: JSON.parse(JSON.stringify(userQuestions)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Unable to fetch questions.',
    };
  }
};

const getUserAnswers = async params => {
  try {
    await connectDB();

    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    if (!userId) {
      return {
        success: false,
        error: 'userId is required.',
      };
    }

    const totalAnswers = await AnswerModel.countDocuments({
      author: userId,
    });

    const userAnswers = await AnswerModel.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .populate('question', '_id title')
      .populate('author', '_id name picture')
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalAnswers > skipAmount + userAnswers.length;
    return {
      success: true,
      message: 'User Answers fetched successfully.',
      isNext,
      totalAnswers: JSON.parse(JSON.stringify(totalAnswers)),
      answers: JSON.parse(JSON.stringify(userAnswers)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Unable to fetch questions.',
    };
  }
};

const updateUser = async params => {
  try {
    await connectDB();

    const { userId, updateData, path } = params;
    if (!userId || !updateData) {
      return {
        success: false,
        error: 'userId, and updateData is required.',
      };
    }
    console.log(userId, updateData);
    await UserModel.findOneAndUpdate({ _id: userId }, updateData, {
      new: true,
    });
    revalidatePath(path);
    return {
      success: true,
      message: 'User succesfully updated.',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Unable to edit user',
    };
  }
};

export {
  getAllUsers,
  getUserById,
  toggleSaveQuestion,
  getSavedQuestions,
  getUserInfo,
  getLoggedInUserInfo,
  getUserQuestions,
  getUserAnswers,
  updateUser,
};
