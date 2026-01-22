const express = require('express')

const router = express.Router()

const StudentController = require('../controllers/studentTestContoller')

router.get('/student-testinomials',StudentController.getStudetnTests)
router.get('/student-testinomials/:id',StudentController.getStudTestById)
router.post('/student-testinomials',StudentController.createStuTestnomial)
router.put('/student-testinomials/:id',StudentController.updateStuTest)
router.delete('/student-testinomials/:id',StudentController.deleteStuTestinomial)



module.exports = router;