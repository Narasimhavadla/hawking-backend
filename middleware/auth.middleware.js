const jwt = require('jsonwebtoken')

verifyToken = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401);
    }

    jwt.verify(token,process.env.JWT_SECRETE,(err,user) =>{
        if(err) {
            return res.status(403);
        }
        req.user = user
        next();
    })
} 