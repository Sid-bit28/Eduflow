'use server';

import { connectDB } from '@/config/connectDB';
import { authOptions } from '@/lib/authOptions';
import AnswerModel from '@/models/Answer.Model';
import InteractionModel from '@/models/Interaction.Model';
import QuestionModel from '@/models/Question.Model';
import TagModel from '@/models/Tag.Model';
import UserModel from '@/models/User.Model';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const getQuestions = async params => {
  try {
    await connectDB();

    const { searchQuery, filter, page = 1, pageSize = 2 } = params;
    // Calculate the number of posts to skip based on the page number and page size

    const skipAmount = (page - 1) * pageSize;

    // Search functionality for questions
    const query = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }
    let sortOptions = {};
    switch (filter) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'popular':
        sortOptions = { views: -1 };
        break;
      case 'unanswered':
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await QuestionModel.find(query)
      .populate({
        path: 'tags',
        model: TagModel,
      })
      .populate({ path: 'author', model: UserModel })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await QuestionModel.countDocuments(query);
    const isNext = totalQuestions > skipAmount + questions.length;

    return {
      success: true,
      message: 'Fetched all question successfully.',
      isNext,
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
    if (!title || !content || !tags) {
      return {
        success: false,
        error: 'title, content & tags are required.',
      };
    }

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

    // Create an interation record for the user's ask question action
    await InteractionModel.create({
      user: author,
      action: 'ask_question',
      question: question._id,
      tags: tagDocuments,
    });

    // Increament author's reputation by +5 for creating a question
    await UserModel.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
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
    // Increment author's reputation

    // Increment author's reputation by +1/-1 for upvoting/revoking an upvote to the question

    await UserModel.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpvoted ? -1 : 1 },
    });

    // Increment author's reputation by +10/-10 for upvoting/revoking an upvote to the question

    await UserModel.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasUpvoted ? -10 : 10 },
    });

    revalidatePath(path);

    return {
      success: true,
      message: 'Question Upvoted Successfully.',
    };
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
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownvoted ? -2 : 2 },
    });

    await UserModel.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 },
    });

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

const deleteQuestion = async params => {
  try {
    await connectDB();

    const { questionId, path } = params;
    if (!questionId) {
      return {
        success: false,
        error: 'questionId is required.',
      };
    }

    await QuestionModel.deleteOne({ _id: questionId });
    await AnswerModel.deleteMany({ question: questionId });
    await InteractionModel.deleteMany({ question: questionId });
    await TagModel.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
    return {
      success: true,
      message: 'Question successfully deleted.',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Unable to delete question.',
    };
  }
};

const editQuestion = async params => {
  try {
    await connectDB();

    const { questionId, title, content, path } = params;
    (questionId, title);
    if (!questionId || !title || !content) {
      return {
        success: false,
        error: 'questionId, title, and content are required.',
      };
    }

    const question = await QuestionModel.findById(questionId).populate('tags');
    if (!question) {
      return {
        success: false,
        error: 'question not found.',
      };
    }


    question.title = title;
    question.content = content;

    await question.save();
    revalidatePath(path);

    return {
      success: true,
      message: 'Question successfully edited.',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Unable to edit question.',
    };
  }
};

const getHotQuestions = async params => {
  try {
    await connectDB();

    const hotQuestions = await QuestionModel.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return {
      success: true,
      message: 'Successfully fetched hot questions.',
      hotQuestions: JSON.parse(JSON.stringify(hotQuestions)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Unable to fetch hot questions',
    };
  }
};

const getRecommendedQuestions = async params => {
  try {
    await connectDB();

    const { page = 1, pageSize = 20, searchQuery } = params;

    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('User not authenticated.');
    }

    const userId = session?.user?.id;

    const skipAmount = (page - 1) * pageSize;

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

    // Get diatinct tag ID's from the user's interactions
    const distinctUserTagIds = [...new Set(userTags.map(tag => tag.id))];

    const query = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user tags
        { author: { $ne: userId } }, // Excluding user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const totalQuestions = await QuestionModel.countDocuments(query);

    const recommendedQuestions = await QuestionModel.find(query)
      .populate({
        path: 'tags',
        model: TagModel,
      })
      .populate({
        path: 'author',
        model: UserModel,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return {
      success: true,
      questions: JSON.parse(JSON.stringify(recommendedQuestions)),
      isNext,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Unable to fetch recommended questions.',
    };
  }
};

export {
  createQuestion,
  getQuestions,
  getQuestionById,
  upvoteQuestion,
  downvoteQuestion,
  deleteQuestion,
  editQuestion,
  getHotQuestions,
  getRecommendedQuestions,
};
