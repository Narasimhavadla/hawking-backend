const express = require('express')
const {catchError,notFoundErr} = require('../utils/errorHandler')
const {Sequelize} = require('sequelize')




const examController = {

    getExamSchedule: async (req, res) => {
        try {
            const examScheudle = await req.examModel.findAll();

            const totalExams = examScheudle.length;

            const activeExams = await req.examModel.count({
            where: { status: "active" },
            });

            const inactiveExams = await req.examModel.count({
            where: { status: "inactive" },
            });

            res.status(200).send({
            status: true,
            message: "Successfully fetched",
            data: examScheudle,
            meta: {
                total_examSchedule: totalExams,
                activeExams,
                inactiveExams,
            },
            });
        } catch (err) {
            catchError(res, err, "Failed to get Data");
        }
        },

    //create exam schedule 

    createExamSchedule : async (req,res) =>{
        try{

            const {examName,year,status,lastRegistrationDate,onlineExamDate,onlineExamResultDate,
                onlineLiveInterviewDate,finalResultDate,
                amount,examFormat

            } = req.body

            if(!examName || !year || !status || !lastRegistrationDate || !amount) {
                return res.status(404).send({
                    status : false,
                    message : "Required fields are missing"
                })
            }

            const createExam = await req.examModel.create({examName,year,status,lastRegistrationDate,
                onlineExamDate,onlineExamResultDate,onlineLiveInterviewDate,finalResultDate,amount,
                examFormat
            })

            res.status(201).send({
                status : true,
                message : "Created succesfully",
                data : createExam
            })

        }
        catch(err){
            catchError(res,err,"Failed to create")
        }
    },

    //get by Id

    getExamScheduleById : async (req,res) =>{
        try{
            const exmaSchedule = await req.examModel.findByPk(req.params.id);
            if(!exmaSchedule){
                // return res.status(404).send({
                //     status : false,
                //     message : "Not found"
                // })
                return notFoundErr(res,"Not found")
                
                
            }

            res.status(200).send({
                status : true,
                message : "Fetched Succesfully",
                data : exmaSchedule
            })

        }
        catch(err){
            catchError(res,err,"Failed to fetch by id")
        }
    },

    //update 

    updateExamSchedule : async (req,res) =>{
            try{
                const {examName,year,status,lastRegistrationDate,
                onlineExamDate,onlineExamResultDate,onlineLiveInterviewDate,finalResultDate,amount,
                examFormat} = req.body
                const examSchedule = await req.examModel.findByPk(req.params.id)

                if(!examSchedule){
                    return notFoundErr(res,"Not found")
                }

                const updateExamSched = await examSchedule.update({
                    examName : examName ?? examSchedule.examName,
                    year : year ?? examSchedule.year,
                    status : status ?? examSchedule.status,
                    lastRegistrationDate : lastRegistrationDate ?? examSchedule.lastRegistrationDate,
                    onlineExamDate : onlineExamDate ?? examSchedule.onlineExamDate,
                    onlineExamResultDate : onlineExamResultDate ?? examSchedule.onlineExamResultDate,
                    onlineLiveInterviewDate : onlineLiveInterviewDate ?? examSchedule.onlineLiveInterviewDate,
                    finalResultDate : finalResultDate ?? examSchedule.finalResultDate,
                    amount : amount ?? examSchedule.amount,
                    examFormat : examFormat ?? examSchedule.examFormat
            })

                res.status(200).send({
                    status : true,
                    message : "Updated Succesfully",
                    data : updateExamSched
                })


            }
            catch(err){
                catchError(res,err,"Failed to update")
            }
    },


    //delete 

    deleteExamSchedule : async (req,res) =>{
        try{

            const examSchedule = await req.examModel.findByPk(req.params.id)
            if(!examSchedule){
                return notFoundErr(res,"Not found")
            }

            const deleteExam = {...examSchedule.dataValues}

            await examSchedule.destroy()

            res.status(200).send({
                status : false,
                message : "Deleted succesfully",
                data : deleteExam

            })
        }
        catch(err){
            catchError(res,err,"Failed to delete !")
        }
    },


    getTeacherDashboardStats: async (req, res) => {
    try {
      const { teacherId } = req.params;

      if (!teacherId) {
        return res.status(400).send({
          status: false,
          message: "Teacher ID is required",
        });
      }

      /* 1️⃣ Total students registered by this teacher */
      const totalStudents = await req.studentModel.count({
        where: { teacherId },
      });

      /* 2️⃣ Active exams count (global) */
      const activeExams = await req.examModel.count({
        where: { status: "active" },
      });

      /* 3️⃣ Distinct exams where this teacher registered students */
      const examsWithStudents = await req.studentModel.count({
        where: {
          teacherId,
          examId: {
            [Sequelize.Op.ne]: null,
          },
        },
        distinct: true,
        col: "examId",
      });

      res.status(200).send({
        status: true,
        message: "Teacher dashboard data fetched successfully",
        data: {
          totalStudents,
          activeExams,
          examsWithStudents,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        status: false,
        message: "Failed to fetch teacher dashboard data",
      });
    }
  },

 
  getTeacherStudentsPie: async (req, res) => {
    try {
      const teacherId = req.params.teacherId;

      if (!teacherId) {
        return res.status(400).send({
          status: false,
          message: "Teacher ID is required",
        });
      }

      const result = await req.studentModel.findAll({
        attributes: [
          ["Class", "name"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "value"],
        ],
        where: { teacherId: teacherId },
        group: ["Class"],
        raw: true,
      });

      // Define all possible classes (optional)
      const allClasses = [
        "Class-4",
        "Class-5",
        "Class-6",
        "Class-7",
        "Class-8",
        "Class-9",
      ];

      const formattedData = allClasses.map((cls) => {
        const found = result.find((r) => r.name === cls);
        return {
          name: cls,
          value: found ? Number(found.value) : 0,
        };
      });

      res.status(200).send({
        status: true,
        data: formattedData,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        status: false,
        message: "Failed to fetch pie chart data",
      });
    }
  },
        
} 

module.exports = examController