const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema({
    fname : {type:String, required:true, trim:true},
    lname : {type:String, required:true, trim:true},
    email : {type: String, required: true, trim: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/},
    profileImage : {type:String},
    phone : {type: String, required: true, unique: true, match: /^[6-9]\d{9}$/, trim: true},
    password : {type:String, required:true, minlength:8, maxlength:15},
    address: {
        shipping: {street: { type: String, trim: true, required: true },
        city: { type: String, trim: true, required: true },
        pincode: { type: Number, trim: true, required: true }},
        billing: {
            street: {type: String, trim: true, required: true},
            city: {type: String, trim: true, required: true},
            pincode: {type: Number, trim: true, required: true}
        }
        
    },
    
  
}, {timestamps:true});

module.exports = mongoose.model('Users', userSchema);