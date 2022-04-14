const productModel = require('../models/productModel');
const validator = require('../utils/validator');
const aws = require('../aws/s3Upload');



const createProduct = async (req,res)=>{
    try {

        let requestBody = req.body;
        let files = req.files;
        const {title, description, price, currencyId, currencyFormat,availableSizes,isFreeShipping, style, installments, deletedAt, isDeleted} = requestBody;
        if(!requestBody.title){
            return res.status(400).json({status:false, msg: `Title is mandatory!`});  
        }
        if(!validator.isValidString(title)){
            return res.status(400).json({status:false, msg: `Please input valid Title!`});
        }
        const isTitleAlreadyUsed = await productModel.findOne({ title: title });
        if (isTitleAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${title} is already exists!` });
        }
        if(!requestBody.description){
            return res.status(400).json({status:false, msg: `Description is mandatory!`});  
        }
        if(!validator.isValidString(description)){
            return res.status(400).json({status:false, msg: `Please input valid Description!`});
        }
        if(!requestBody.price){
            return res.status(400).json({status:false, msg: `Price is mandatory!`});  
        }
        if(!validator.isValidNumber(price)){
            return res.status(400).json({status:false, msg: `Please input valid Price(Numeric Values Only)!`});
        }
        if(!requestBody.currencyId){
            return res.status(400).json({status:false, msg: `Currency ID is mandatory!`});  
        }
        if(!validator.isValidString(currencyId)){
            return res.status(400).json({status:false, msg: `Please input valid Currency ID!`});
        }
        if(!requestBody.currencyFormat){
            return res.status(400).json({status:false, msg: `Currency Format is mandatory!`});  
        }
        if(!validator.isValidString(currencyFormat)){
            return res.status(400).json({status:false, msg: `Please input valid Currency Format!`});
        }
        if(!validator.isValidString(availableSizes)){
            return res.status(400).json({status:false, msg: `Size can only be: S, XS, M, X, L, XXL, XL`});
        }
        if(!validator.isValidString(currencyId)){
            return res.status(400).json({status:false, msg: `Currency ID can only be: INR, USD, GBP, EUR, AED`});
        }

        if(!/\b(?:USD|AUD|BRL|GBP|CAD|CNY|DKK|AED|EUR|HKD|INR|MYR|MXN|NZD|PHP|SGD|THB|ARS|COP|CLP|PEN|VEF)\b/.test(currencyId)){
            return res.status(400).json({status:false, msg: `Currency ID can only be: INR, USD, GBP, EUR, AED`});
        }
        


        


        productImage = await aws.uploadFile(files[0]);
        let finalData = {title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments ,deletedAt, isDeleted};      
        const userData = await productModel.create(finalData);
        res.status(201).json({status:true, data:userData});


        
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}

const getProductsByFilter = async (req,res)=> {
    try {

        const {name, size, priceGreaterThan, priceLessThan, priceSort} = req.query;

        const queryFilter = {};
        queryFilter.isDeleted = false;

        if(name){
            queryFilter.title = { $regex: name, $options: 'i' };
            //for substring searching
        }

        if(size){
            queryFilter.availableSizes = {$regex: size};
        }

        if(priceGreaterThan){
            queryFilter.price = {$gt: priceGreaterThan};
        }

        if(priceLessThan){
            queryFilter.price = {$lt: priceLessThan};
        }
        

        let result = await productModel.find(queryFilter).sort({ price: priceSort});

        const products = await result;
        
        if (!(products.length > 0)) {
            return res.status(404).json({ status: false, msg: `No Product found with given filters!` });
        }
      
        res.status(200).json({status: true, data: products});

        
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }

}
// const getBooks = async (req, res) => {
//   try {
//     let queryFilter = req.query;
//     queryFilter.isDeleted = false;

//     const books = await bookModel
//       .find(queryFilter)
//       .select({
//         _id: 1,
//         title: 1,
//         excerpt: 1,
//         userId: 1,
//         category: 1,
//         releasedAt: 1,
//       });
//     if (!(books.length > 0)) {
//       return res
//         .status(404)
//         .json({ status: false, msg: `No Book found with matching filters!` });
//     }
//     const sortedBooks = books.sort((a, b) => a.title.localeCompare(b.title));
//     res.status(200).json({ status: true, data: sortedBooks });
//   } catch (error) {
//     res.status(500).json({ status: false, error: error.message });
//   }
// };







const getProductsById = async (req,res) => {
    try {
        let { productId: _id } = req.params;
        if (!validator.isValidObjectId(_id)) {
            return res.status(400).json({ status: false, msg: `Invalid Product ID!` });
        }
        const userData = await productModel.findById(_id);

        if (!userData) {
            return res.status(404).json({ status: false, msg: `${_id} is not present in DB!` });
        }
        const idAlreadyDeleted = await productModel.findOne({ _id: _id });
        if (idAlreadyDeleted.isDeleted === true) {
        return res.status(404).json({ status: false, msg: `Product Not Found or Deleted!` });
        }

        res.status(200).json({status:true, data: userData});

        
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }

}

const updateProductById = async (req,res)=>{
    try {
        let { productId: _id } = req.params;
        let requestBody = req.body;
        const {title, description, price, currencyId, currencyFormat,availableSizes} = requestBody;
  
        if (!validator.isValidObjectId(_id)) {
        return res.status(400).json({ status: false, msg: `Invalid Product ID!` });
        }
  
        const checkID = await productModel.findById(_id);
  
        if (!checkID) {
        return res.status(404).json({ status: false, msg: `${_id} is not present in DB!` });
        }
        const idAlreadyDeleted = await productModel.findOne({ _id: _id });
        if (idAlreadyDeleted.isDeleted === true) {
        return res.status(400).json({ status: false, msg: `Product already deleted!` });
        }
        const isTitleAlreadyUsed = await productModel.findOne({ title: title});

        if (isTitleAlreadyUsed) {
        return res.status(400).send({ status: false, message: `${title} already exists!`});
        }
        if(!validator.isValidString(title)){
            return res.status(400).json({status:false, msg: `Please input valid Title!`});
        }


        if(!validator.isValidString(description)){
            return res.status(400).json({status:false, msg: `Please input valid Description!`});
        }
        
        if(!validator.isValidNumber(price)){
            return res.status(400).json({status:false, msg: `Please input valid Price(Numeric Values Only)!`});
        }
        
        if(!validator.isValidString(requestBody.currencyId)){
            return res.status(400).json({status:false, msg: `Please input valid Currency ID!`});
        }
        
        // if(!validator.isValidString(currencyId)){
        //     return res.status(400).json({status:false, msg: `Currency ID can only be: INR, USD, GBP, EUR, AED`});
        // }

        if(!/\b(?:USD|AUD|BRL|GBP|CAD|CNY|DKK|AED|EUR|HKD|INR|MYR|MXN|NZD|PHP|SGD|THB|ARS|COP|CLP|PEN|VEF)\b/.test(currencyId)){
            return res.status(400).json({status:false, msg: `Currency ID can only be: INR, USD, GBP, EUR, AED`});
        }
           


        
        // if(!validator.isValidString(requestBody.currencyFormat)){
        //     return res.status(400).json({status:false, msg: `Please input valid Currency Format!`});
        // }
        // if(!validator.isValidSize(requestBody.availableSizes)){
        //     return res.status(400).json({status:false, msg: `Size can only be: S, XS, M, X, L, XXL, XL`});
        // }
        

        const newData = await productModel.findByIdAndUpdate({ _id }, requestBody, {new: true});
        res.status(201).json({ status: true, msg: `Updated Successfully`, data: newData });
        
    } catch (error) {
        res.status(500).json({ status: false, error: error.message }); 
    }
}

const deleteProductById = async (req, res) => {
    try {
      let { productId: _id } = req.params;
      if (!validator.isValidObjectId(_id)) {
        return res.status(400).json({ status: false, msg: `Invalid Product ID!` });
      }
      const checkID = await productModel.findById(_id);
  
      if (!checkID) {
        return res
          .status(404)
          .json({ status: false, msg: `${_id} is not present in DB!` });
        }
  
      const idAlreadyDeleted = await productModel.findOne({ _id: _id });
      if (idAlreadyDeleted.isDeleted === true) {
        return res
          .status(400)
          .json({ status: false, msg: `Product already deleted!` });
        }
  
       const productData = await productModel.findByIdAndUpdate(
        { _id },
        { isDeleted: true },
        { new: true }
      );
  
      res.status(200).json({ status: true, data: productData});
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  };
  

module.exports = {
    createProduct,
    getProductsByFilter,
    updateProductById,
    getProductsById,
    deleteProductById
}