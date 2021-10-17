const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);

    // catch specific class
    const eduSystem = await models.educationalSystem.findById(id);
    if (!eduSystem) return APIResponse.NotFound(res);

    // await models.subject.deleteMany({ class: id });
    // await models.student.deleteMany({ class: id });

    // delete class
    await eduSystem.delete();

    return APIResponse.NoContent(res);
});
