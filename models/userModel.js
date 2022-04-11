const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
 
const userSchema = new mongoose.Schema({
    fname : {type:String, required:true, trim:true},
    lname : {type:String, required:true, trim:true},
    email : {type: String, required: true, trim: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/},
    profileImage : {type:String},
    phone : {type: String, required: true, unique: true, match: /^[6-9]\d{9}$/, trim: true},
    password : {type:String, required:true, minlength:8, maxlength:15},
    address: {
        shipping: {
            street: { type: String, trim: true, required: true },
            city: { type: String, trim: true, required: true },
            pincode: { type: Number, trim: true, required: true }},
        billing: {
            street: {type: String, trim: true, required: true},
            city: {type: String, trim: true, required: true},
            pincode: {type: Number, trim: true, required: true}
        }
        
    },
    
  
}, {timestamps:true});

//hashing the password and stroing it in the DB.
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('Users', userSchema);




// {
//     "fname": "arun",
//     "lname" : "sharma",
//     "email" : "arun@gmail.com",
//     "phone" : "9900012300",
//     "password" : "qwertyuiop",  
//     "address": {
//         "shipping" : {
//             "street": "sdfgh",
//             "city": "delhi",
//             "pincode": "123456"
//         },
//         "billing" : {
//             "street": "wetyu",
//             "city": "delhi",
//             "pincode": "123456"
//         }
//     }
// }