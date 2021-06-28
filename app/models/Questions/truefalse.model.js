const mongoose = require('mongoose');
const $baseSchema = require('../$baseSchema');
const QuestionModel = require('./_question.model');

const schema = new mongoose.Schema(
  {
    modelAnswer: {
      type: Boolean,
      required: true,
    },
  },
  { discriminatorKey: 'type' },
);

module.exports = QuestionModel.discriminator(
  'truefalse',
  $baseSchema('truefalse', schema),
);
