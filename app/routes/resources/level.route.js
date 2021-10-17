const express = require('express');
const policies = require('../../policies');
const ctrls = require('../../controllers');

let router = express.Router();

router.get('/levels/:id', ctrls.LevelCtrl.fetchOne);
router.get('/levels', ctrls.LevelCtrl.fetchAll);
router.post(
  '/levels',
  policies.isAllowed(['admin']),
  ctrls.LevelCtrl.CreateOne,
);
router.patch(
  '/levels/:id',
  policies.isAllowed(['admin']),
  ctrls.LevelCtrl.UpdateOne,
);
router.delete(
  '/levels/:id',
  policies.isAllowed(['admin']),
  ctrls.LevelCtrl.DeleteOne,
);

module.exports = router;
