const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const { flushSync } = require('react-dom');

// const jwtSecret = process.env.REACT_APP_JWT_SECRET;
const jwtSecret = 'AnimeshJwt@Secret';
// console.log("Secret code : "+jwtSecret);

let success = true;

//*************Use of Express validator ********************** */
//Validating the email, name, passward using express validator.

// [body('email','Enter valid email.').isEmail(),body('name','Enter a valid name').isLength({min:3}),body('passward','Passward atleast 5 character.').isLength({min:5})]//Used for express validator.

// Router = 1 : Create a user ussing post "api/auth/". Doesn't require authentication.
router.post('/createuser',[body('name','Enter a valid name').isLength({min:3}),body('email','Enter a valid email.').isEmail(),body('password','Password must be at least 5 characters.').isLength({min:5}) ], async(req,res)=>{
    console.log(req.body);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        success = false;
        return res.status(400).json({success,errors:result.array()});
    }

    try{
        //Check whether the user with this email exitsts or not.(unique email validation).
        let user = await User.findOne({email:req.body.email});
        if(user){
            success = false;
            return res.status(400).json({success,error:"Sorry a user with this email already exists."});
        }

        const salt =await bcrypt.genSalt(10); //Because genSalt() method returns promises so this execution should be made await to complete the exexution of the function.
        const secPass =await bcrypt.hash(req.body.password,salt);

        //Creating the user using User Schema.
        user = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:secPass
        })

        const data = {
            user:user.id
        }
        console.log("Secret code : "+jwtSecret);
        const authToken = jwt.sign(data,jwtSecret);
        console.log("Token : "+authToken);

        //Sending response as successfully entered data into the data base msg.
        success = true;
        res.json({success,token : authToken});

        //**This code can also be used to resolve the promises return by the User.create() method and if any error occured then catch the error and send response as error. */

        // .then(user=>res.json(user))
        // .catch(err=>{console.log(err.message);
        // res.json({error:"Enter uniqueue email id."});
        // });
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Some error occured."});
    }    
});


//Router = 2 : Validate a user ussing post "api/auth/login".Require authentication.
router.post('/login',[body('email','Enter a valid email.').isEmail(),body('password','Password cannot be blank').exists() ], async(req,res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
        success = false;
        return res.status(400).json({success,errors:result.array()});
    }

    const {email,password} = req.body;
    // console.log("Requested email : ",email," password : ",password);
    try {
        const user = await User.findOne({email:email});
        if(!user){
            success = false;
            res.status(400).json({error:"Please try to login with correct credential."});
        }

        const passwordCompare = await bcrypt.compare(password,user.password);
        if(passwordCompare){
            success = true;
            const data = {
                user:user.id
            }

            const authToken = jwt.sign(data,jwtSecret);
            res.json({
                success,
                message:"Loggin successful",
                token : authToken
            });
            // console.log("User : "+user);
        }
        else{
            success = false;
            res.status(400).json({success,error:"Please try to login with correct credential."});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Some internal error occured."});
    }
});


//Router = 3 : Get loggedin user details using post "api/auth/getuser". No loggin requires.
router.post('/getuser',fetchuser,async(req,res)=>{
    try {
        const user =req.user;//Getting the user id set by the fetchUser middleware in req field.
        console.log(user);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Some internal error occured."});
    }
})

module.exports = router;