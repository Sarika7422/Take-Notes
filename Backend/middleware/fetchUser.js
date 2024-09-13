const jwt = require('jsonwebtoken');
const jwtSecret = "AnimeshJwt@Secret";
const User = require('../models/User');
// const jwtSecret = process.env.REACT_APP_JWT_SECRET;

//Creating the middleware function.
const fetchuser =async(req,res,next)=>{
    //Get the user from the jwt token and add id to req object.
    const token = req.header('auth-token');
    // console.log("token : "+token);
    if(!token){
       return res.status(401).json({error:"Please authenticate using a valid token"});
    }
    
    try {
        const data =jwt.verify(token,jwtSecret);
        const userId = data.user;
        const user =await User.findById(userId);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({error:"Please authenticate using a valid token"});
    }

}

module.exports = fetchuser;