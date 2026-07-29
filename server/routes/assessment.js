const express = require('express');
const { generateAndSaveTest, submitAndEvaluateTest } = require('../controller/assessment.controller');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();

// Route entry point to kickstart the validation workflow
router.post('/start-test',fetchuser,generateAndSaveTest);
router.post('/submit-test', fetchuser, submitAndEvaluateTest);

module.exports = router;