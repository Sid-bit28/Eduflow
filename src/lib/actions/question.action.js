import { connectDB } from '@/config/connectDB';
import QuestionModel from '@/models/Question.Model';
import TagModel from '@/models/Tag.Model';

export async function CreateQuestion(params) {
  try {
    await connectDB();

    const { title, content, tags, author, path } = params;

    // Create a question
    const question = await QuestionModel.create({ title, content, author });

    const tagDocuments = [];

    // Create the tags or get them if they already exists in the database

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
  } catch (error) {}
}
