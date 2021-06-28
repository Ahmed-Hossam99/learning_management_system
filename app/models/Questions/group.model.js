const mongoose = require('mongoose');
const $baseSchema = require('../$baseSchema');
const QuestionModel = require('./_question.model');

const schema = new mongoose.Schema(
  {
    childrenQuestions: [
      {
        type: Number,
        ref: 'question',
      },
    ],
  },
  { discriminatorKey: 'type' },
);

module.exports = QuestionModel.discriminator(
  'group',
  $baseSchema('group', schema),
);
