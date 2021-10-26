const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require('lodash')

module.exports = $baseCtrl(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);
    let teacher = await models.teacher.findById(id);
    if (!teacher) {
        return APIResponse.NotFound(res, "No teacher With That Id");
    }

    const sections = await models.section
        .find({ _id: { $in: req.body.sections } })
        .populate("level");

    let changed = false;

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        //add section to current doctor 
        if (teacher.sections.indexOf(section.id) === -1) {
            teacher.sections.push(section.id)
            //if current section in new level in  doctor levels 
            if (teacher.levels.indexOf(section.level.id) === -1)
                teacher.levels.push(section.level.id)

        } else if (teacher.sections.indexOf(section.id) !== -1) {
            return APIResponse.NotFound(res, "sorry this teacher alredy teach to this section ");

        }
    }
    await teacher.save();

    return APIResponse.Ok(res, teacher);



});
