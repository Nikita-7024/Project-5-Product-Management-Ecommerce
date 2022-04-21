const mongoose = require('mongoose');
const validator = require('../utils/validator');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel');
const { find } = require('../models/cartModel');


const createOrder = async(req,res)=>{

    try {

        if(Object.keys(req.body).length == 0)
            return res.status(400).json({status:false, msg:`Invalid Input. Body can't be empty!`});
        let requestBody = req.body;

        const {userId, items, totalPrice, totalItems, totalQuantity} = requestBody;  //Destructuring Method --

        // validation start ----------------------
        let { userId: _id } = req.params;

        if (!validator.isValidObjectId(_id)) {
            return res.status(400).json({ status: false, msg: `Invalid ID!` });
        }
        if(!validator.isValidObjectId(userId))
            return res.status(400).json({status:false, msg:`Invalid User ID!`}); 
        
        if(!validator.isValidObjectId(items[0].productId))
            return res.status(400).json({status:false, msg:`Invalid Product ID!`});
        
        if(!validator.isValidNumber(items[0].quantity))
            return res.status(400).json({status:false, msg:`Invalid Input. Quantity should have a numeric value!`});  
        
        if(!validator.isValidNumber(totalPrice))
            return res.status(400).json({status:false, msg:`Invalid Input. Total Price should have a numeric value!`});      
        
        if (!requestBody.totalPrice) {
                return res.status(400).json({ status: false, msg: `Total Price is mandatory field!`});
        }    
            
        if(!validator.isValidNumber(totalItems))
            return res.status(400).json({status:false, msg:`Invalid Input. Total Items should have a numeric value!`});    
        
        if (!requestBody.totalItems) {
                return res.status(400).json({ status: false, msg: `Total Items is mandatory field!`});
        }        
    
        if(!validator.isValidNumber(totalQuantity))
            return res.status(400).json({status:false, msg:`Invalid Input. Total Quantity should have a numeric value!`})
            // validation ends ----------------

        const checkUserID = await userModel.findById(_id);
        const userIdForCart = checkUserID._id.toString();
        console.log(userIdForCart);
  
        if (!checkUserID) {
        return res.status(404).json({ status: false, msg: `${_id} is not present in DB!` });
        }
        // create cart --------------
        
        const orderData = await orderModel.create(requestBody);
        
        res.status(201).json({status:true, data: orderData});


        
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }

}

const updateOrder = async (req,res)=>{

    let requestBody = req.body;

    const {status, userId} = requestBody;

    let { userId: _id } = req.params;

    if (!validator.isValidObjectId(_id)) {
        return res.status(400).json({ status: false, msg: `Invalid ID!` });
    }

    const userData = await userModel.findById(_id);
    if (!userData) {
        return res.status(401).json({ status: false, msg: `User not authorised to perform this action!` });
    }

    const findOrderId = await orderModel.findOne({userId: _id});
    const orderID = findOrderId._id.toString();
    //console.log(orderID); 
    

    if(!/\b(?:completed|pending|cancelled)\b/.test(status)){
        return res.status(400).json({ status: false, msg: `Status can only be completed, pending or cancelled` });
    }
    
    if(findOrderId.status === 'cancelled') {
        return res.status(400).json({ status: false, msg: `Order already cancelled!` });
    }
    // update cart------------------------

    const updateOrder = await orderModel.findByIdAndUpdate(orderID, req.body, {new:true});
    res.status(201).json({status:true, msg:`Order Updated Successfully`, data:updateOrder});

}




module.exports = {
    createOrder,
    updateOrder
}



 