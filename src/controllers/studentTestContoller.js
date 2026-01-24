const express = require('express')
const sequelize = require('../config/db')

const studentTestinomials = {
    getStudetnTests : async (req,res) =>{
        try{
            const testinomials =await req.stuTestModel.findAll()
            res.status(200).send({
                status : true,
                message : "succesfully fetched",
                data : testinomials,
                meta : {total_testinomials : testinomials.length}
            })
        }
        catch(err){
            res.status(500).send({
                status : false,
                message : "Failed to get testinomials"
            })
        }
    },
  

    getStudTestById : async (req,res) =>{

        try{

            const testinomy = await req.stuTestModel.findByPk(req.params.id)

            if(!testinomy){
                res.status(404).send({
                    status : false,
                    message : "Not found"
                })
            }

            res.status(200).send({
                status : true,
                message : "Succesfully fetched by Id",
                data : testinomy
            })
        }
        catch(err){
            res.status(500).send({
                status : false,
                message : "Failed to fetch by id"
            })
        }

    },


    //create student testnomials /api/v1/student-testinomials

    createStuTestnomial : async(req,res) =>{

        const {name,content,rating} = req.body

        if(!name || !content || !rating){
            return res.status(400).send({
                status : false,
                message : "All fields are Required"
            })
        }

        const createTest = await req.stuTestModel.create({name,content,rating})

        res.status(201).send({
            status : true,
            message : "Create duccesfully",
            data : createTest
        })


    },

    //update testinomial by id
    //api/v1/student-testinomials/:id

    updateStuTest : async (req,res) =>{
        try{

            const {name,content,rating} = req.body;
            const testinomy = await req.stuTestModel.findByPk(req.params.id)

            if(!testinomy){
                return res.status(404).send({
                    status : false,
                    message : "Not found"
                })
            }

            const updateTestinomial = await testinomy.update(
                {
                    name : name ?? testinomy.name,
                    content : content ?? testinomy.content,
                    rating : rating ?? testinomy.rating
                }
            )

            res.status(200).send({
                status : true,
                message : "Updated Succesfully",
                data : updateTestinomial
            })
        }
        catch(err){
            res.status(500).send({
                status : false,
                message : "Failed to update"
            })
        }
    },

    //delete testinomial by id 
    deleteStuTestinomial : async (req,res) =>{
        try{
            const testinomy = await req.stuTestModel.findByPk(req.params.id)

            if(!testinomy){
                return res.status(404).send({
                    status : false,
                    message : "Not found"
                })
            }

            const deleteTestinomy = await {...testinomy.dataValues}

            await testinomy.destroy()

            res.status(200).send({
                status : true,
                message : "Deleted Succesfully",
                data : deleteTestinomy
            })

        }
        catch(err){
            res.status(500).send({
                status : false,
                message : "Failed to Delete"
            })
        }
    },

        toggleStudentTestimonialPublish: async (req, res) => {
            try {
            const testimonial = await req.stuTestModel.findByPk(req.params.id);

            if (!testimonial) {
                return res.status(404).send({
                status: false,
                message: "Testimonial not found",
                });
            }

            // If publishing → check limit
            if (!testimonial.isPublished) {
                const count = await req.stuTestModel.count({
                where: { isPublished: true },
                });

                if (count >= 4) {
                return res.status(400).send({
                    status: false,
                    message: "Only 4 student testimonials can be published",
                });
                }
            }

            testimonial.isPublished = !testimonial.isPublished;
            await testimonial.save();

            res.status(200).send({
                status: true,
                message: "Status updated",
                data: testimonial,
            });
            } catch (err) {
            res.status(500).send({
                status: false,
                message: "Failed to toggle testimonial",
            });
            }
        },

        getPublishedStudentTestimonials: async (req, res) => {
            try {
            const testimonials = await req.stuTestModel.findAll({
                where: { isPublished: true },
                limit: 4,
                order: [["updatedAt", "DESC"]],
            });

            res.status(200).send({
                status: true,
                data: testimonials,
            });
            } catch (err) {
            res.status(500).send({
                status: false,
                message: "Failed to fetch student testimonials",
            });
            }
        },






}

module.exports = studentTestinomials;