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
        
        const {userId, items } = req.body;
    
        if(!validator.isValidObjectId(userId))
            return res.status(400).json({status:false, msg:`Invalid User ID!`});
        
        if(!validator.isValidObjectId(items[0].productId))
            return res.status(400).json({status:false, msg:`Invalid Product ID!`});    
        
             
        if(!validator.isValidNumber(items[0].quantity))
            return res.status(400).json({status:false, msg:`Invalid Input. Quantity should have a numeric value!`}); 
        
        const findProduct = await productModel.findById(req.body.items[0].productId);//checking for product
        const productCost = findProduct.price; //extracting product price

        let productQuantity = req.body.items[0].quantity;
        console.log(productQuantity);
        
        let totalPrice = productCost * productQuantity;
        let totalItems = productQuantity;

        let finalData = {userId, items, totalPrice, totalItems};

        const cartData = await cartModel.create(finalData);
        res.status(201).json({status:true, data: cartData});
        
     
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}

    






module.exports = {
    createCart
}