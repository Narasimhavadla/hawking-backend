const catchError = (res,err,message = "Internal server error", statusCode  = 500) => {
    return res.status(statusCode).send({
        status : false,
        message
    })

}

const notFoundErr = (res,message = "Not found ") =>{
    return res.status(404).send({
        status : false,
        message,

    })
}

module.exports = {catchError,notFoundErr}