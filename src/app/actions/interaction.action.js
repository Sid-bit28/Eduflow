'use server';

import { connectDB } from '@/config/connectDB';
import InteractionModel from '@/models/Interaction.Model';
import QuestionModel from '@/models/Question.Model';

const viewQuestion = async params => {
  try {
    await connectDB();

    const { questionId, userId } = params;
    if (!questionId || !userId) {
      return {
        success: false,
        error: 'questionId & userId is required.',
      };
    }

    // Update the view count we are currently viewing
    await QuestionModel.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await InteractionModel.findOne({
        user: userId,
        action: 'view',
        question: questionId,
      });

      if (existingInteraction) {
        return {
          success: true,
          message: 'Question already viewed',
        };
      }

      // Create an interaction
      await InteractionModel.create({
        user: userId,
        action: 'view',
        question: questionId,
      });

      return {
        success: true,
        message: 'Question viewed successfully',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to view question',
    };
  }
};

export { viewQuestion };
