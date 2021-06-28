const mongoose = require('mongoose');
const $baseSchema = require('../$baseSchema');
const QuestionModel = require('./_question.model');

const schema = new mongoose.Schema(
  {
    choices: [
      {
        type: String,
        required: true,
      },
    ],
    modelAnswer: {
      type: Number,
      required: true,
    },
  },
  { discriminatorKey: 'type' },
);

module.exports = QuestionModel.discriminator(
  'choose',
  $baseSchema('choose', schema),
);
