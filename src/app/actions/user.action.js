'use server';

import { connectDB } from '@/config/connectDB';
import { authOptions } from '@/lib/authOptions';
import UserModel from '@/models/User.Model';
import { getServerSession } from 'next-auth';

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

export { getAllUsers, getUserById };
