const express = require("express");
// const userschema = require("../models/user.schema");
const userschema = require("../users/user.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const userSchema = require("../models/user.schema");

const register = async  (req, res) => {
    const { name, email, phone, userName, password, country} = req.body; 
    console.log(name, phone, userName, password, country);

    const verifyemail = await userschema.findOne({ email: email });
    const verifyphone = await userschema.findOne({ phone: phone });

    // register the user
    try{
        if (verifyemail ||  verifyphone ) {
            return res.status(403).json({sucess: false, message: "Email or Phone already in use"})
        } else {
            if (password){
                bcrypt.hash(password, 10).then((hashresult) =>{
                    const user = new userschema({
                        name, email, phone, password: hashresult, country, userName,
                    });
                    //Sends back response to our database
                    user.save().then((response) => {         
                        console.log(response.data);
                        let  jwtToken =jwt.sign(
                            {
                                userId: response._id,
                                email: response.email,
                                name: response.name,
                                userName: response.userName,
                                phone: response.phone,
                            },
                            process.env.SECRET,
                            { expiresIn: "1d" }
                        );
                        return  res.status(201).json({success: true, 
                             data: {accessToken: jwtToken},
                             message: "User Registered Successfully"})
                    });
                })
                .catch((err) => {
                    res.status(500).json({error: err, });  //this is catching the error coming from the bcrypt (.save)
                });
            }
        }
    } catch (error) {
        return res.status(412).send({
            success: false,
            message: error,
        });

    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    let getUser;

    userschema.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: "Authorization Failed" });
            }
            getUser = user; // store user for later use
            return bcrypt.compare(password, user.password);
        })
        .then((response) => {
            if (!response) {
                return res.status(401).json({ message: "Invalid Password" });
            } else {
                const jwtToken = jwt.sign(
                    {
                        email: getUser.email,
                        userId: getUser._id,
                        username: getUser.userName,
                        phone: getUser.phone,
                    },
                    process.env.SECRET,
                    { expiresIn: "1d" }
                );
                return res.status(200).json({
                    success: true,
                    data: { accessToken: jwtToken },
                    message: "Login Successfully",
                });
            }
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        });
};


const getUserinfo = async (req, res) =>{ 
    const data = req.userData;
    console.log("from ctrl", data);
    res.status(200).json({success: true, data: data.phone});
};

const getUseremail = async (req, res) => {
  try {
    console.log("From controller ", req.userData );                           /////Print to the server control 

    const email = req.userData?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email not found" }); 
    }

    const user = await userschema.findOne({ email });
    console.log("From DB user ===", user);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, userId: user._id }); 
  } catch (err) {
    console.error( err );
    res.status(500).json({ success: false, error: err.message });
  }
};


module.exports ={register, login, getUserinfo, getUseremail };