const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    title : {type: String, trim:true, required:true, unique:true},
    description : {type:String, required:true, trim:true},
    price : {type:Number, required:true},
    currencyId : {type:String, required:true, trim:true, uppercase:true, match:/\b(?:USD|AUD|BRL|GBP|CAD|CNY|DKK|AED|EUR|HKD|INR|MYR|MXN|NZD|PHP|SGD|THB|ARS|COP|CLP|PEN|VEF)\b/},
    currencyFormat : {type:String, required:true, trim:true},
    isFreeShipping : {type:Boolean, default:false},
    productImage : {type:String},
    style : {type:String},
    availableSizes: [{type:String, trim:true, uppercase:true}],
    installments: {type:Number},
    deletedAt : {type:Date, default:null},
    isDeleted : {type:Boolean, default:false}

}, {timestamps: true});

module.exports = mongoose.model('Products', productSchema);
