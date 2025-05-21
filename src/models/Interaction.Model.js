const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const interactionSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  },
  {
    timestamps: true,
  }
);

const InteractionModel =
  mongoose.models.Interaction ||
  mongoose.model('Interaction', interactionSchema);

module.exports = InteractionModel;
