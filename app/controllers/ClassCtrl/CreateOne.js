const $baseCtrl = require('../$baseCtrl');
const models = require('../../models');
const { APIResponse } = require('../../utils');


module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) return APIResponse.NotFound(res)
  let level = await models.level.findById(id);
  if (!level) return APIResponse.NotFound(res, 'No Level With that id');
  // create class
  req.body.level = id;
  const newClass = await new models.class(req.body).save();
  // await newClass.populate(['system'])
  return APIResponse.Created(res, newClass);
});
