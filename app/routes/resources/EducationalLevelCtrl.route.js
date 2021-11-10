const express = require('express');
const policies = require('../../policies');
const ctrls = require('../../controllers');

let router = express.Router();

router.get('/levels/:id', ctrls.EducationalLevelCtrl.fetchOne);
router.get('/levels', ctrls.EducationalLevelCtrl.fetchAll);
router.post(
  '/levels',
  policies.isAllowed(['admin']),
  ctrls.EducationalLevelCtrl.CreateOne,
);
router.patch(
  '/levels/:id',
  policies.isAllowed(['admin']),
  ctrls.EducationalLevelCtrl.UpdateOne,
);
router.delete(
  '/levels/:id',
  policies.isAllowed(['admin']),
  ctrls.EducationalLevelCtrl.DeleteOne,
);

module.exports = router;
