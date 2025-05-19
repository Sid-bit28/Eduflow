'use server';

import { connectDB } from '@/config/connectDB';
import { authOptions } from '@/lib/authOptions';
import UserModel from '@/models/User.Model';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const getAllUsers = async params => {
  try {
    await connectDB();

    const users = await UserModel.find({}).sort({ createdAt: -1 });

    return {
      success: true,
      message: 'Users fetched successfully.',
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

    const user = await UserModel.findById(userId);

    if (!userId) {
      return {
        status: false,
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
      status: false,
      error: 'Toggle Save Question failed.',
    };
  }
};

export { getAllUsers, getUserById, toggleSaveQuestion };
