'use server';

import { connectDB } from '@/config/connectDB';
import QuestionModel from '@/models/Question.Model';
import TagModel from '@/models/Tag.Model';
import UserModel from '@/models/User.Model';

const getTopInteractedTags = async params => {
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
        error: 'user not found.',
      };
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

const getQuestionByTagId = async params => {
  try {
    await connectDB();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    if (!tagId) {
      return {
        success: false,
        error: 'tagId is required.',
      };
    }

    const tagFilter = { _id: tagId };

    const tag = await TagModel.findById(tagFilter).populate({
      path: 'questions',
      model: QuestionModel,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: 'tags', model: TagModel, select: '_id name' },
        { path: 'author', model: UserModel, select: '_id name picture' },
      ],
    });

    if (!tag) {
      return {
        success: false,
        error: 'Tag not found.',
      };
    }

    const questions = tag.questions;

    return {
      success: true,
      message: 'Fetched Saved Questions Successfully.',
      tagTitle: tag.name,
      questions: JSON.parse(JSON.stringify(questions)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch questions by tag ID.',
    };
  }
};

const getPopularTags = async params => {
  try {
    await connectDB();

    const popularTags = await TagModel.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 10 },
    ]);
    console.log(popularTags);

    return {
      success: true,
      message: 'Successfully fetched popular tags.',
      popularTags: JSON.parse(JSON.stringify(popularTags)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Unable to fetch popular tags.',
    };
  }
};

export { getTopInteractedTags, getAllTags, getQuestionByTagId, getPopularTags };
