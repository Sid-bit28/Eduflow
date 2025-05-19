'use server';

import { connectDB } from '@/config/connectDB';
import TagModel from '@/models/Tag.Model';
import UserModel from '@/models/User.Model';

const getTopInteractedTags = async params => {
  try {
    await connectDB();

    const { userId } = params;

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const tags = [
      { _id: '1', name: 'tag1' },
      { _id: '2', name: 'tag2' },
    ];

    return {
      success: true,
      message: 'Top interacted tags fetched successfully.',
      tags: JSON.parse(JSON.stringify(tags)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch top interacted tags.',
    };
  }
};

const getAllTags = async params => {
  try {
    await connectDB();
    const tags = await TagModel.find({}).sort({ createdAt: -1 });

    return {
      success: true,
      message: 'Tags fetched successfully.',
      tags: JSON.parse(JSON.stringify(tags)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch all tags.',
    };
  }
};

export { getTopInteractedTags, getAllTags };
