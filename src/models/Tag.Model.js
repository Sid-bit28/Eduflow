const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const TagModel = mongoose.models.Tag || mongoose.model('Tag', tagSchema);

module.exports = TagModel;
