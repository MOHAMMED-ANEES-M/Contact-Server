const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const saltRounds = 10;
var jwt = require('jsonwebtoken');


// POST /api/users/register
const registerUser = asyncHandler(async (req,res) => {
    const { username, email, password } = req.body
    if( !username || !email || !password ) {
        res.status(400);
        throw new Error('All fields are mandatory')
    }
    const userExist = await User.findOne({email})
    if (userExist) {
        res.status(400);
        throw new Error('User already registered')
    }
    const hashedPassword = await bcrypt.hash( password, saltRounds )
    console.log('Hashed Password:',hashedPassword);
    const user = await User.create({ username, email, password: hashedPassword })
    if (user) {   
        console.log('User created',user);
        res.status(201).json(user)
    } else {
        res.status(400);
        throw new Error('User data is invalid')
    }
})

// POST /api/users/login
const loginUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    const user = await User.findOne({email})
    if ( user && (await bcrypt.compare( password, user.password ))) {
        const accessToken = jwt.sign(
             { user: { username: user.username, email: user.email, id: user.id }},
             process.env.ACCESS_TOKEN_SECRET,
             {expiresIn: '60m'})
        res.status(200).json({ accessToken, success: true })
    } else {
        res.status(404);
        throw new Error("Email or Password is not valid")
    }
})

// GET /api/users/current
const currentUser = asyncHandler(async (req,res) => {
    res.json(req.user)
    console.log('Current user:',req.user);
})


module.exports = { registerUser, loginUser, currentUser }