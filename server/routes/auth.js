const { Router } = require("express");
const router = Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.post("/register", async (req,res) => {
    try{
        const {username, password} = req.body

        if(!username) return res.json({status: "bad", msg: "username require"})
        if(!password) return res.json({status: "bad", msg: "password require"})

        if(username.trim().length < 5) return res.json({status: "bad", msg: "username min length 5"})
        if(username.trim().length > 20) return res.json({status: "bad", msg: "username max length 20"})
        if(password.trim().length > 20) return res.json({status: "bad", msg: "password max length 20"})

        const existUser = await User.findOne({username})
        if(existUser) return res.json({status: "bad", msg: "exist User"});

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: username.trim().toLowerCase(),
            password: password.trim().toLowerCase()
        });
        console.log(newUser);
        const token = await jwt.sign(newUser, "tokensecret")

        return res.json({
            status: "OK",
            msg: "success register user",
            user: newUser,
            token
        })
    }catch(error){
        return res.json({status: "bad request", msg: error.message})
    }
})

module.exports = router
