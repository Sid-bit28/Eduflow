'use server';

import { connectDB } from '@/config/connectDB';
import AnswerModel from '@/models/Answer.Model';
import QuestionModel from '@/models/Question.Model';
import TagModel from '@/models/Tag.Model';
import UserModel from '@/models/User.Model';

const searchableTypes = ['question', 'answer', 'user', 'tag'];
const globalSearch = async params => {
  try {
    await connectDB();

    const { query, type } = params;

    const regexQuery = { $regex: query, $options: 'i' };

    let results = [];

    const modelsAndTypes = [
      { model: QuestionModel, searchField: 'title', type: 'question' },
      { model: UserModel, searchField: 'name', type: 'user' },
      { model: AnswerModel, searchField: 'content', type: 'answer' },
      { model: TagModel, searchField: 'name', type: 'tag' },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // Search for everything...
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map(item => ({
            title:
              type === 'answer'
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === 'user'
                ? item._id
                : type === 'answer'
                  ? item.question
                  : item._id,
          }))
        );
      }
    } else {
      // Search for a specified model type...
      const modelInfo = modelsAndTypes.find(item => item.type === type);
      if (!modelInfo) {
        throw new Error('Invalid search type');
      }

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);

      results = queryResults.map(item => ({
        title:
          type === 'answer'
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === 'user'
            ? item._id
            : type === 'answer'
              ? item.question
              : item._id,
      }));
    }

    return {
      success: true,
      message: 'Global fetched successfully.',
      results: JSON.parse(JSON.stringify(results)),
    };
  } catch (error) {
    console.log(`Error fetching global results, ${error}`);
    throw error;
  }
};

export { globalSearch };
