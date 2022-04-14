const mongoose = require('mongoose');
const validator = require('../utils/validator');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');

const createCart = async (req,res) => {

    try {
        let userIdFromParams = req.params.userId;
        if(!validator.isValidObjectId(userIdFromParams))
            return res.status(400).json({status:false, msg:`Invalid User ID!`});
    
        if(Object.keys(req.body).length == 0)
            return res.status(400).json({status:false, msg:`Invalid Input. Body can't be empty!`});
        
        const {userId, items ,productId, quantity} = req.body;
    
        if(!validator.isValidObjectId(userId))
            return res.status(400).json({status:false, msg:`Invalid User ID!`});
        
        if(!validator.isValidObjectId(productId))
            return res.status(400).json({status:false, msg:`Invalid Product ID!`});    
        
        // const checkProductId = await productModel.findById(req.body.productId);
        // console.log(checkProductId);
        // if(!checkProductId)
        //     return res.status(400).json({status:false, msg:`${req.body.productId} doesn't exist in DB!`}); 

        if(!validator.isValidNumber(quantity))
            return res.status(400).json({status:false, msg:`Invalid Input. Quantity should have a numeric value!`});    
    
        const cartData = await cartModel.create(req.body);
        res.status(201).json({status:true, data: cartData});
     
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}

    






module.exports = {
    createCart
}