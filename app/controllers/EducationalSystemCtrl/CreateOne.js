const $baseCtrl = require('../$baseCtrl')
const models = require('../../models')
const { APIResponse } = require('../../utils')

module.exports = $baseCtrl(async (req, res) => {
    const newEducationalSystem = await new models.educationalSystem(req.body).save()
    return APIResponse.Created(res, newEducationalSystem)
})