    const express = require('express')

    const ParentTestinoial = {

        getParentTestinomials : async(req,res) =>{
            try{

                const testinomials = await req.parentTestModel.findAll()
                res.status(200).send({
                    status : true,
                    message : "Succesfully Fetched",
                    data : testinomials,
                    meta : {totalTestinomials : testinomials.length}
                })

            }
            catch(err){
                res.status(500).send({
                    status : false,
                    message : "Failed to get Testinomials"
                })
            }

        },

        //get testinomial by id
    //    getParentTestById: async (req, res) => {
    //     try {
    //         const testinomial = await req.parentTestModel.findByPk(req.params.id)

    //         if (!testinomial) {
    //             return res.status(404).send({
    //                 status: false,
    //                 message: "Testinomial not Found"
    //             })
    //         }

    //         res.status(200).send({
    //             status: true,
    //             message: "Successfully fetched by Id",
    //             data: testinomial
    //         })
    //     } catch (err) {
    //         console.error(err)
    //         res.status(500).send({
    //             status: false,
    //             message: "Failed to get by Id"
    //         })
    //     }
    // },

    getParentTestById : async (req,res) =>{
        try{
            const testinomial = await req.parentTestModel.findByPk(req.params.id)

            if(!testinomial){
                return res.status(404).send({
                    status : false,
                    message : "not found"
                })
            }
            res.status(200).send({
                status : true,
                message : "Succesfully fetched",
                data : testinomial
            })
        }
        catch(err){
            res.status(500).send({
                status : false,
                message : "Failed to fetch by id"
            })
        }
    },

        // createTestinomial

        createTestinomial : async (req,res) =>{
            try{
                const {name,content,rating} = req.body

                if(!name || ! content || !rating) {
                    return res.status(404).send({
                        status : false,
                        message : "All fields are required !"
                    })
                }

                const parentTestinomy = await req.parentTestModel.create({name,content,rating})

                res.status(201).send({
                    status : true,
                    message : "Testinomial Created Succesfull",
                    data : parentTestinomy
                })
            }
            catch(err){
                res.status(500).send({
                    status : false,
                    message : "Failed to create Testinomial"
                })
            }
        },

        //update testinomial api/v1/parent-testinomial/:id

        updateParentTestinomial : async (req,res) =>{
            try{

                const {name,content,rating} = req.body
                const testinomy = await req.parentTestModel.findByPk(req.params.id)

                if(!testinomy){
                    return res.status(404).send({
                        status : false,
                        message : "Not found"
                    })
                }

                const updateTestinomy = await testinomy.update({
                    name : name ?? testinomy.name,
                    content : content ?? testinomy.content,
                    rating : rating ?? testinomy.rating
                })

                res.status(200).send({
                    status : false,
                    message : "Succefully updated",
                    data : updateTestinomy
                })

            }
            catch(err){
                res.status(500).send({
                    status : false,
                    message : "Internal server Error"
                })
            }
        },

        //delete by id /api/v1/parent-testinoial/:id

        deleteTestinomial : async (req,res) =>{
            try{
                const testinomy = await req.parentTestModel.findByPk(req.params.id)

                if(!testinomy){
                    return res.status(404).send({
                        status : false,
                        message : "ID not found"
                    })
                }

                const deleteTestinomy = {...testinomy.dataValues}
                await testinomy.destroy()

                res.status(200).send({
                    status : true,
                    message : "Deleted Succesfully",
                    data : deleteTestinomy
                })
            }
            catch(err){
                res.status(500).send({
                    statu : false,
                    message :" Failed to delete"
                })
            }
        },

        toggleParentTestimonialPublish: async (req, res) => {
        try {
            const testimonial = await req.parentTestModel.findByPk(req.params.id);

            if (!testimonial) {
            return res.status(404).send({
                status: false,
                message: "Testimonial not found",
            });
            }

            if (!testimonial.isPublished) {
            const count = await req.parentTestModel.count({
                where: { isPublished: true },
            });

            if (count >= 4) {
                return res.status(400).send({
                status: false,
                message: "Only 4 testimonials can be published",
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


        getPublishedParentTestimonials: async (req, res) => {
        try {
            const testimonials = await req.parentTestModel.findAll({
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
            message: "Failed to fetch testimonials",
            });
        }
        },


    }

    module.exports = ParentTestinoial;