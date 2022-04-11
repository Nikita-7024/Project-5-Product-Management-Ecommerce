const userModel = require('../models/userModel');
const validator = require('../utils/validator');
const aws = require('../aws/profilePicture');
const jwt = require('jsonwebtoken');
const createUser = async (req,res)=> {
    try {
        let requestBody = req.body;
        let files = req.files;
       
        // if(Object.keys(requestBody).length == 0){
        // return res.status(400).json({status:false, msg: `Please input some data in the body!`});
        // }
        let {fname, lname, email, password ,phone, address} = requestBody;

        // if(!requestBody.fname){
        //     return res.status(400).json({status:false, msg: `First Name is mandatory!`});  
        // }
        if(!validator.isValidString(fname)){
            return res.status(400).json({status:false, msg: `Please input valid First Name!`});
        }
        // if(!requestBody.lname){
        //     return res.status(400).json({status:false, msg: `Last Name is mandatory!`});  
        // }
        if(!validator.isValidString(lname)){
            return res.status(400).json({status:false, msg: `Please input valid Last Name!`});
        }
        // if(!requestBody.email){
        //     return res.status(400).json({status:false, msg: `eMail is mandatory!`});
        // }
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
        // if (!requestBody.password) {
        //     return res.status(400).json({ status: false, msg: `password is mandatory field!` });
        // }
        if (!validator.isValidString(password)) {
            return res.status(400).json({ status: false, msg: `password is mandatory field!` });
        }
        if (!validator.isValidPassword(password)) {
            return res.status(400).json({ status: false, msg: `password must be 8-15 characters long!` });
        }

        // if (!requestBody.phone) {
        //     return res.status(400).json({ status: false, msg: `phone is mandatory field!` });
        // }
      
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
        // if (!requestBody.address) {
        //     return res.status(400).json({ status: false, msg: `address is mandatory field!` });
        // }
        if (!validator.isValidString(address)) {
            return res.status(400).json({ status: false, msg: `address is mandatory field!`});
        }

        //profileImage = await aws.uploadFile(files[0]);

        let finalData = {fname, lname, email, password, phone, address};      
        const userData = await userModel.create(finalData);
        res.status(201).json({status:true, data:userData});

        
    } catch (error) {
        res.status(500).json({status:false, error: error.message});
        console.log(error);
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

  const updateUserProfile = async (req,res)=>{
    try {
        let { userId: _id } = req.params;
        let requestBody = req.body;
        const {fname, lname, email, password, profileImage ,phone, address} = requestBody;
  
        if (!validator.isValidObjectId(_id)) {
        return res.status(400).json({ status: false, msg: `Invalid User ID!` });
        }
  
        const checkID = await userModel.findById(_id);
  
        if (!checkID) {
        return res.status(404).json({ status: false, msg: `${_id} is not present in DB!` });
        }
        const isEmailAlreadyUsed = await userModel.findOne({ email: email});

        if (isEmailAlreadyUsed) {
        return res.status(400).send({ status: false, message: `${email} already exists!`});
        }
        
        // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        // return res.status(400).json({ status: false, msg: `Invalid eMail Address!` });
        // }
        const isPhoneAlreadyUsed = await userModel.findOne({ phone: phone});
        if (isPhoneAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${phone} already exists!`});
        }

        if (checkID._id.toString() !== req.params.userId) {
            //console.log(checkID._id, req.params.userId );
            return res.status(401).json({status: false,msg: `User not authorised to update profile!`});
        }

        const newData = await userModel.findByIdAndUpdate({ _id }, requestBody, {new: true});
        res.status(201).json({ status: true, msg: `Updated Successfully`, data: newData });



    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
  }
  

module.exports = {
    createUser,
    userLogIn,
    getUserProfile,
    updateUserProfile
}





// const updateBookById = async (req, res) => {
//     try {
//       let { userId: _id } = req.params;
//       let requestBody = req.body;
//       const {fname, lname, email, password, profileImage ,phone, address} = requestBody;
  
//       if (!validator.isValidObjectId(_id)) {
//         return res.status(400).json({ status: false, msg: `Invalid User ID!` });
//       }
  
//       const checkID = await userModel.findById(_id);
  
//       if (!checkID) {
//         return res
//           .status(404)
//           .json({ status: false, msg: `${_id} is not present in DB!` });
//       }
//       const isEmailAlreadyUsed = await userModel.findOne({ email: email});
//       if (isEmailAlreadyUsed) {
//         return res
//           .status(400)
//           .send({ status: false, message: `${email} already exists!`});
//        }
//       if (!validator.isValidString(email)) {
//         return res.status(400).json({ status: false, msg: `email is mandatory field!` });
//         }
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         return res.status(400).json({ status: false, msg: `Invalid eMail Address!` });
//     }
//       if (!title) {
//         return res
//           .status(400)
//           .json({ status: false, msg: `Give a valid title for updation!` });
//       }
//       if (!validator.isValidString(title)) {
//         return res
//           .status(400)
//           .json({ status: false, msg: `Please provide a valid title!` });
//       }
//       if (!requestBody.releasedAt) {
//         return res
//           .status(400)
//           .json({ status: false, msg: `Release Date is missing!` });
//       }
//       if (!validator.isValidString(releasedAt)) {
//         return res
//           .status(400)
//           .json({ status: false, msg: `Release Date is mandatory field!` });
//       }
  
//       if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) {
//         return res
//           .status(400)
//           .json({ status: false, msg: `Invalid Date format!` });
//       }
//       if (!requestBody.title) {
//         return res
//           .status(400)
//           .json({ status: false, msg: `title is a mandatory field!` });
//       }
//       const isTitleAlreadyUsed = await bookModel.findOne({ title: title });
//       if (isTitleAlreadyUsed) {
//         return res
//           .status(400)
//           .send({
//             status: false,
//             message: `${title} already exists! Give a Unique title...`,
//           });
//       }
//       const idAlreadyDeleted = await bookModel.findOne({ _id: _id });
//       if (idAlreadyDeleted.isDeleted === true) {
//         return res
//           .status(404)
//           .json({ status: false, msg: `Book Not Found or Deleted!` });
//       }
  
//       let userId = req.query.userId;
//       if (!userId) {
//         return res
//           .status(400)
//           .json({ status: false, msg: `User ID Query not present!` });
//       }
  
//       if (checkID.userId.toString() !== req.query.userId) {
//         //console.log(checkID.userId.toString(), req.query.userId );
//         return res
//           .status(401)
//           .json({
//             status: false,
//             msg: `User not authorised to delete this book!`,
//           });
//       }
  
//       const newData = await bookModel.findByIdAndUpdate({ _id }, requestBody, {
//         new: true,
//       });
//       res
//         .status(201)
//         .json({ status: true, msg: `Updated Successfully`, data: newData });
//     } catch (error) {
//       res.status(500).json({ status: false, error: error.message });
//     }
//   };
  



 