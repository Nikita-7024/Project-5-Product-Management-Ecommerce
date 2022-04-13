const userModel = require('../models/userModel');
const validator = require('../utils/validator');
const aws = require('../aws/s3Upload');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ManagedBlockchain } = require('aws-sdk');


const createUser = async (req,res)=> {
    try {
        let requestBody = req.body;
        let files = req.files;
       
       
        let {fname, lname, email, password ,phone, address} = requestBody;

        if(!requestBody.fname){
            return res.status(400).json({status:false, msg: `First Name is mandatory!`});  
        }
        if(!validator.isValidString(fname)){
            return res.status(400).json({status:false, msg: `Please input valid First Name!`});
        }
        if(!requestBody.lname){
            return res.status(400).json({status:false, msg: `Last Name is mandatory!`});  
        }
        if(!validator.isValidString(lname)){
            return res.status(400).json({status:false, msg: `Please input valid Last Name!`});
        }
        if(!requestBody.email){
            return res.status(400).json({status:false, msg: `eMail is mandatory!`});
        }
        if (!validator.isValidString(email)) {
            return res.status(400).json({ status: false, msg: `email is mandatory field!` });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ status: false, msg: `Invalid eMail Address!` });
        }
        const isEmailAlreadyUsed = await userModel.findOne({ email: email });
        if (isEmailAlreadyUsed) {
        return res.status(400).send({ status: false, message: `${email} is already registered!` });
        }
        if (!requestBody.password) {
            return res.status(400).json({ status: false, msg: `password is mandatory field!` });
        }
        if (!validator.isValidString(password)) {
            return res.status(400).json({ status: false, msg: `password is mandatory field!` });
        }
        if (!validator.isValidPassword(password)) {
            return res.status(400).json({ status: false, msg: `password must be 8-15 characters long!` });
        }

        if (!requestBody.phone) {
            return res.status(400).json({ status: false, msg: `phone is mandatory field!` });
        }
      
        if (!validator.isValidString(phone)) {
            return res.status(400).json({ status: false, msg: `phone is mandatory field!` });
        }
      
        if (!/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ status: false, msg: `Invalid Phone Number!` });
        }
        const isPhoneAlreadyUsed = await userModel.findOne({ phone: phone });
        if (isPhoneAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${phone} is already registered` });
        }
        if (!requestBody.address) {
            return res.status(400).json({ status: false, msg: `address is mandatory field!` });
        }
        if (!validator.isValidString(address)) {
            return res.status(400).json({ status: false, msg: `address is mandatory field!`});
        }
        //Shipping address valiadtion.
        if (!requestBody.address["shipping"]["street"]) {
            return res.status(400).json({ status: false, msg: `street is mandatory field!` });
        }
        if (!requestBody.address["shipping"]["city"]) {
            return res.status(400).json({ status: false, msg: `city is mandatory field!` });
        }
        if (!requestBody.address["shipping"]["pincode"]) {
            return res.status(400).json({ status: false, msg: `PIN code is mandatory field!` });
        }
        //Billing Address Validation.
        if (!requestBody.address["billing"]["street"]) {
            return res.status(400).json({ status: false, msg: `street is mandatory field!` });
        }
        if (!requestBody.address["billing"]["city"]) {
            return res.status(400).json({ status: false, msg: `city is mandatory field!` });
        }
        if (!requestBody.address["billing"]["pincode"]) {
            return res.status(400).json({ status: false, msg: `PIN code is mandatory field!` });
        }

        profileImage = await aws.uploadFile(files[0]);
        

        let finalData = {fname, lname, email, password, profileImage ,phone, address};      
        const userData = await userModel.create(finalData);
        res.status(201).json({status:true, data:userData});

        
    } catch (error) {
        res.status(500).json({status:false, error: error.message});
        
    }
}

const userLogIn = async (req, res) => {
    try {
      let requestBody = req.body;
      if (Object.keys(requestBody).length === 0) {
        return res
          .status(400)
          .json({
            status: false,
            msg: `Invalid input. Please enter email and password!`,
          });
      }
      const { email, password } = requestBody;
  
      if (!requestBody.email) {
        return res
          .status(400)
          .json({ status: false, msg: `email is mandatory field!` });
      }
      if (!validator.isValidString(email)) {
        return res
          .status(400)
          .json({ status: false, msg: `email is mandatory field!` });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res
          .status(400)
          .json({ status: false, msg: `Invalid eMail Address!` });
      }
      if (!requestBody.password) {
        return res
          .status(400)
          .json({ status: false, msg: `password is mandatory field!` });
      }
      if (!validator.isValidString(password)) {
        return res
          .status(400)
          .json({ status: false, msg: `password is mandatory field!` });
      }
  
      const findUser = await userModel.findOne({
        email: email,
        password: password,
      });
      if (!findUser) {
        return res
          .status(401)
          .json({ status: false, msg: `Invalid email or password!` });
      }
  
      const token = jwt.sign(
        {
          userId: findUser._id,
        },
        "thorium@group8", {expiresIn: '1500mins'}
      );
  
      res.setHeader("x-api-key", token);
      let UserID = findUser._id
      let finalData = {token, UserID}
      res
        .status(201)
        .json({ status: true, msg: `user login successful`, data: finalData });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  };

  const getUserProfile = async (req,res)=>{
    try {
        let { userId: _id } = req.params;
        if (!validator.isValidObjectId(_id)) {
            return res.status(400).json({ status: false, msg: `Invalid ID!` });
        }
        const userData = await userModel.findById(_id);

        if (!userData) {
            return res.status(404).json({ status: false, msg: `${_id} is not present in DB!` });
        }
        res.status(200).json({status:true, data: userData});

        
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
  }

  const updateUserProfile = async (req,res) => {
    try {
        let { userId: _id } = req.params;
        let requestBody = req.body;
        let files = req.files
        
        let {fname, lname, email, phone, address} = requestBody;
  
        if (!validator.isValidObjectId(_id)) {
        return res.status(400).json({ status: false, msg: `Invalid User ID!` });
        }
  
        const checkID = await userModel.findById(_id);
  
        if (!checkID) {
        return res.status(404).json({ status: false, msg: `${_id} is not present in DB!` });
        }
        
        const isEmailAlreadyUsed = await userModel.findOne({ email: email});

        if (isEmailAlreadyUsed) {
        return res.status(400).send({ status: false, message: `${email} already registered!`});
        }

        // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        //     return res.status(400).json({ status: false, msg: `Invalid eMail Address!`});
        // }
        
        
        const isPhoneAlreadyUsed = await userModel.findOne({ phone: phone});
        if (isPhoneAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${phone} already exists!`});
        }

        if (checkID._id.toString() !== req.params.userId) {
            //console.log(checkID._id, req.params.userId );
            return res.status(401).json({status: false,msg: `User not authorised to update profile!`});
        }
        
        //requestBody.password = await bcrypt.hash(requestBody.password, 10);
        profileImage = await aws.uploadFile(files[0]);

        const doc = new userModel();

        const newData = await userModel.findByIdAndUpdate({ _id },requestBody, {new: true});
        res.status(201).json({ status: true, msg: `Updated Successfully`, data: newData });



    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
        console.log(error);
    }
  }
  

module.exports = {
    createUser,
    userLogIn,
    getUserProfile,
    updateUserProfile
}





//regex - set of chars used for validation 

///^[^\s@]+@[^\s@]+\.[^\s@]+$/




 

