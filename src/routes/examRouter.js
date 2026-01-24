const express = require('express')

const router = express.Router()

const examScheduleController = require('../controllers/examController')


// router.get('/exam-schedule/count',examScheduleController.getExamCount)


router.get('/exam-schedule',examScheduleController.getExamSchedule)
router.get('/exam-schedule/:id',examScheduleController.getExamScheduleById)
router.post('/exam-schedule',examScheduleController.createExamSchedule)
router.put('/exam-schedule/:id',examScheduleController.updateExamSchedule)
router.delete('/exam-schedule/:id',examScheduleController.deleteExamSchedule)

// router.get("/testimonials/public", examScheduleController.getPublishedTestimonials);



module.exports = router