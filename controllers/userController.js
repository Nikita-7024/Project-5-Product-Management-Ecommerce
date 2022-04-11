const userModel = require('../models/userModel');
const validator = require('../utils/validator');
const bcrypt = require('bcrypt');

const createUser = async (req,res)=> {
    try {
        let requestBody = req.body;
        if(Object.keys(requestBody).length == 0){
        return res.status(400).json({status:false, msg: `Please input some data in the body!`});
        }
        let {fname, lname, email, password, phone, address} = requestBody;
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

        // const user = new userModel(requestBody);
        // const salt = await bcrypt.genSalt(10);
       
        // user.password = await bcrypt.hash(password, salt);
        // user.save(password);

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
        
        const userData = await userModel.create(requestBody);
        res.status(201).json({status:true, data:userData});

      
        





    } catch (error) {
        res.status(500).json({status:false, error: error.message});
    }

}


module.exports = {
    createUser
}







