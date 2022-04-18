const mongoose = require('mongoose');
const validator = require('../utils/validator');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel');


const createOrder = async(req,res)=>{

    try {

        if(Object.keys(req.body).length == 0)
            return res.status(400).json({status:false, msg:`Invalid Input. Body can't be empty!`});
        let requestBody = req.body;

        const {userId, productId} = requestBody;

        let { userId: _id } = req.params;
        if (!validator.isValidObjectId(_id)) {
            return res.status(400).json({ status: false, msg: `Invalid ID!` });
        }
        const checkUserID = await userModel.findById(_id);
        const userIdForCart = checkUserID._id.toString();
        console.log(userIdForCart);
  
        if (!checkUserID) {
        return res.status(404).json({ status: false, msg: `${_id} is not present in DB!` });
        }
        // if(!validator.isValidObjectId(productId)){
        //     return res.status(400).json({ status: false, msg: `Invalid Product ID!` });
        // }

        const cartDetails = await cartModel.findOne({userIdForCart: userIdForCart});
        console.log(cartDetails);

        

        const finalData = {userId, productId, items:cartDetails}
        

        const orderData = await orderModel.create(finalData);
        
        res.status(201).json({status:true, data: orderData});


        
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }

}




module.exports = {
    createOrder
}