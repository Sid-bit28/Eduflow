import { connectDB } from '@/config/connectDB';
import UserModel from '@/models/User.Model';

export async function getUserById(params) {
  try {
    connectDB();

    const { userId } = params;
    const user = await UserModel.findOne({ _id: userId });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}
