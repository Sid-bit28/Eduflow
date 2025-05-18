const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const AnswerModel =
  mongoose.models.Answer || mongoose.model('Answer', answerSchema);

module.exports = AnswerModel;
