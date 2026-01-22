const express = require('express')
const {catchError,notFoundErr} = require('../utils/errorHandler')




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

            const {name,year,status,lastRegistrationDate,onlineExamDate,onlineExamResultDate,
                onlineLiveInterviewDate,finalResultDate,
                amount,examFormat

            } = req.body

            if(!name || !year || !status || !lastRegistrationDate || !amount) {
                return res.status(404).send({
                    status : false,
                    message : "Required fields are missing"
                })
            }

            const createExam = await req.examModel.create({name,year,status,lastRegistrationDate,
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
                const {name,year,status,lastRegistrationDate,
                onlineExamDate,onlineExamResultDate,onlineLiveInterviewDate,finalResultDate,amount,
                examFormat} = req.body
                const examSchedule = await req.examModel.findByPk(req.params.id)

                if(!examSchedule){
                    return notFoundErr(res,"Not found")
                }

                const updateExamSched = await examSchedule.update({
                    name : name ?? examSchedule.name,
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
    }
        
} 

module.exports = examController