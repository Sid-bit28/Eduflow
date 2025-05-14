const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    views: { type: Number, default: 0 },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  },
  {
    timestamps: true,
  }
);

const QuestionModel =
  mongoose.models.Question || mongoose.model('Question', questionSchema);

module.exports = QuestionModel;
