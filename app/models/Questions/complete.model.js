const mongoose = require('mongoose');
const $baseSchema = require('../$baseSchema');
const QuestionModel = require('./_question.model');

const schema = new mongoose.Schema(
  {
    numberOfInputs: {
      type: Number,
      required: true,
    },
    modelAnswer: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { discriminatorKey: 'type' },
);

module.exports = QuestionModel.discriminator(
  'complete',
  $baseSchema('complete', schema),
);
