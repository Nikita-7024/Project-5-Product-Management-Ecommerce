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
        //console.log(productQuantity);
        
        let totalPrice = productCost * productQuantity;
        let totalItems = productQuantity;

        let finalData = {userId, items, totalPrice, totalItems};

        const cartData = await cartModel.create(finalData);
        res.status(201).json({status:true, data: cartData});
        
     
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}

const updateCart = async(req,res)=>{

    try {
    let requestBody = req.body;
    const {cartId, productId, items} = requestBody;

    const ifCartExists = await cartModel.findById(requestBody.cartId);
    const cartID = ifCartExists._id.toString();
    console.log(cartID);
    
    if(!ifCartExists){
        res.status(404).json({status:false, msg: `No Cart Found!`})
    }
    const ifProductExists = await productModel.findById(requestBody.productId);
    const productID = ifProductExists._id.toString();
    console.log(productID);
    if(!ifProductExists){
        res.status(404).json({status:false, msg: `No Product Found!`})
    }

    //cartModel---->quantity---->quantity-{removeItem}---->priceUpdate

    const exsitingQuantity = ifCartExists.items[0].quantity; 
    // console.log(exsitingQuantity);
    
    const productQuantity = exsitingQuantity - req.body.items[0].quantity;
    const checkNewQuantity = productQuantity;
    console.log(checkNewQuantity);

    const productCost = ifProductExists.price; 
    // console.log(productCost); 
    // console.log(productQuantity); 

    let totalPrice = productCost * productQuantity;
    let totalItems = productQuantity;

    let finalData = {totalPrice, totalItems, cartID, items};


    const cartData = await cartModel.findByIdAndUpdate(cartID, finalData, {new:true});
    res.status(201).json({status:true, msg: `Cart Updated Succesfully`, data:cartData});

    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}    

const getCartById = async (req,res)=>{
    try {
        let { userId: _id } = req.params;
        if (!validator.isValidObjectId(_id)) {
            return res.status(400).json({ status: false, msg: `Invalid ID!` });
        }
        const userCart = await cartModel.findOne({userId: _id});
        //console.log(userCart);

        if (!userCart) {
            return res.status(404).json({ status: false, msg: `No Cart Found!` });
        }
        res.status(200).json({status:true, data: userCart});

        
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }

}

const deleteCartById = async (req,res)=>{
    try {
        let { userId: _id } = req.params;
        if (!validator.isValidObjectId(_id)) {
            return res.status(400).json({ status: false, msg: `Invalid ID!` });
        }
        const userCart = await cartModel.findOne({userId: _id});
        //console.log(userCart);

        if (!userCart) {
            return res.status(404).json({ status: false, msg: `No Cart Found!` });
        }
        const findCart = await cartModel.findById(userCart);
        const cartID = findCart._id.toString();
        //console.log(cartID);
        const deleteCart = await cartModel.findOneAndUpdate(cartID, {$set: {totalItems: 0, totalPrice:0, items: []}},{new:true});
        res.status(200).json({status:true, data: deleteCart});

        
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
        //console.log(error);
    }

}




module.exports = {
    createCart,
    updateCart,
    getCartById,
    deleteCartById
}