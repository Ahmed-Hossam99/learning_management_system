// const $baseCtrl = require("../$baseCtrl");
// const models = require("../../models");
// const { APIResponse } = require("../../utils");

// module.exports = $baseCtrl(async (req, res) => {
//     const id = parseInt(req.params.id);
//     if (isNaN(id)) return APIResponse.NotFound(res);

//     const subject = await models.subject.findById(id);
//     if (!subject) return APIResponse.NotFound(res, "No Subject With that id ");
//     const teachers = await models.teacher
//         .find({
//             subjects
//                 : id
//         })

//     return APIResponse.Ok(res, teachers);
// });


const models = require("../../models");
const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return APIResponse.NotFound(res);

    const subject = await models.subject.findById(id);
    if (!subject) return APIResponse.NotFound(res, "No Subject With that id ");
    // remah ??
    // if (req.queryFilter.isAssigned) {
    //     req.queryFilter.teacher = { $exists: false };
    //     delete req.queryFilter.isAssigned;
    // }

    const teachers = await models.teacher.fetchAll(
        req.allowPagination,
        {
            ...req.queryFilter,
            subjects: id

        },
        {
            ...req.queryOptions,
            populate: [{ path: "teacher", select: "username photo" }],
        }
    );

    return APIResponse.Ok(res, teachers);
});

