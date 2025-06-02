'use server';

import { connectDB } from '@/config/connectDB';
import InteractionModel from '@/models/Interaction.Model';
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

    // Find the user's interactions
    const userInteractions = await InteractionModel.find({ user: userId })
      .populate('tags')
      .exec();

    // Extract the tags from the user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }

      return tags;
    }, []);

    // Get distinct tag ID's from the user's interactions
    const distinctUserTagIds = [...new Set(userTags.map(tag => tag.id))];
    const topN = Math.min(distinctUserTagIds.length, 3);
    const topDistinctUserTags = distinctUserTagIds.slice(0, topN);

    const tags = [];

    for (const tagId of topDistinctUserTags) {
      const tag = await TagModel.findById(tagId);
      if (tag) {
        tags.push(tag);
      }
    }

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

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
    }

    let sortOptions = {};
    switch (filter) {
      case 'name':
        sortOptions = { name: 1 };
        break;
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { questions: -1 };
        break;
    }

    const tags = await TagModel.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalTags = await TagModel.countDocuments(query);
    const isNext = totalTags > skipAmount + tags.length;
    return {
      success: true,
      message: 'Tags fetched successfully.',
      isNext,
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
    const skipAmount = (page - 1) * pageSize;
    if (!tagId) {
      return {
        success: false,
        error: 'tagId is required.',
      };
    }

    const tagFilter = { _id: tagId };

    const query = {};
    if (searchQuery) {
      query.$or = [{ title: { $regex: new RegExp(searchQuery, 'i') } }];
    }

    const tag = await TagModel.findById(tagFilter).populate({
      path: 'questions',
      model: QuestionModel,
      match: query,
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1,
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
    const isNext = questions.length > pageSize;

    return {
      success: true,
      message: 'Fetched Saved Questions Successfully.',
      isNext,
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
