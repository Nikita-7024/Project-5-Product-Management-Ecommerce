const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const cartSchema = new mongoose.Schema({
    userId: {type:ObjectId, ref:"Users"},
    items: [{
      productId: {type:ObjectId, ref:"Products"},
      quantity: {type:Number}, _id:0
    }],
    totalPrice: {type:Number, default:0},
    totalItems: {type:Number, default:0},
}, {timestamps:true});

module.exports = mongoose.model('Cart', cartSchema);










