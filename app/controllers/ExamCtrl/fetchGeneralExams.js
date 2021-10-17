const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const routePath = req.route.path.split("/");
  const objectType =
    routePath[1] === "lessons"
      ? "lesson"
      : routePath[1] === "units"
      ? "unit"
      : "subject";
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const object = await models[objectType].findById(id);
  if (!object)
    return APIResponse.NotFound(res, `No ${objectType} with that id`);

  let stages = [
    {
      $match: {
        ...(req.me.role === "student" && {
          availability: true,
        }),
        ...(req.me.role === "teacher" && {
          addedBy: req.me.id,
        }),
        object: id,
        objectType,
      },
    },
    {
      $project: {
        ...(req.me.role === "student" && {
          student: {
            $filter: {
              input: "$students",
              as: "student",
              cond: { $eq: ["$$student.student", req.me.id] },
            },
          },
        }),
        numberOfAllowedTimesToSolve: 1,
        duration: 1,
        isTimed: 1,
        passing_percentage: 1,
        title: 1,
        id: "$_id",
        availability: true,
        objectType: 1,
        points: { $sum: "$questions.point" },
      },
    },
  ];
  if (req.me.role === "student")
    stages.push(
      {
        $unwind: { path: "$student", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "solutions",
          localField: "student.solutions",
          foreignField: "_id",
          as: "solutions",
        },
      },
      {
        $addFields: {
          metadata: {
            $map: {
              input: "$solutions",
              as: "solution",
              in: {
                isSolving: {
                  $cond: {
                    if: { $eq: ["$$solution.status", "solving"] },
                    then: true,
                    else: false,
                  },
                },
                isChecking: {
                  $cond: {
                    if: { $eq: ["$$solution.status", "checking"] },
                    then: true,
                    else: false,
                  },
                },
                marks: {
                  $cond: {
                    if: { $eq: ["$$solution.status", "done"] },
                    then: { $sum: "$$solution.questions.mark" },
                    else: "$$REMOVE",
                  },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          isSolving: { $anyElementTrue: ["$metadata.isSolving"] },
          isChecking: { $anyElementTrue: ["$metadata.isChecking"] },
          isPassed: {
            $cond: [
              {
                $lt: [
                  {
                    $multiply: [
                      { $divide: [{ $max: "$metadata.marks" }, "$points"] },
                      100,
                    ],
                  },
                  "$passing_percentage",
                ],
              },
              false,
              true,
            ],
          },
          isAllowed: {
            $cond: {
              if: {
                $lt: [{ $size: "$solutions" }, "$numberOfAllowedTimesToSolve"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $addFields: {
          highestScore: {
            $cond: {
              if: { $eq: [{ $type: { $max: "$metadata.marks" } }, "null"] },
              then: "$$REMOVE",
              else: { $max: "$metadata.marks" },
            },
          },
          lastScore: { $last: "$metadata.marks" },
        },
      },
      {
        $project: {
          student: 0,
          solutions: 0,
          _id: 0,
          metadata: 0,
        },
      }
    );
  let exams = await models.generalExam.aggregate(stages);
  return APIResponse.Ok(res, exams);
});
