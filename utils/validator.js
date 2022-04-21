const mongoose = require('mongoose');

const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId);
}

const isValidString = function(value){
    if(typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}

const isValidSize = function (availableSizes) {
    return ["S", "XS","M","X", "L","XXL", "XL"].indexOf(availableSizes) !== -1;
};

const isValidCurrencyId = function (currencyId) {
    return ["INR", "USD","GBP","EUR", "AED"].indexOf(currencyId) !== -1;
};



const isValidPassword = function (password){
    if(password.length <= 15 && password.length >= 8){
        return true;
    }

}  


const isValidNumber = function(value){
    if(isNaN(value)) return false;
    return true;
}

const isValidStatus = function (status) {
    return ["pending", "completed", "cancled"].indexOf(status) !== -1;
};



module.exports = {
    
    isValidObjectId,
    isValidString,
    isValidSize,
    isValidPassword,
    isValidNumber,
    isValidCurrencyId,
    isValidStatus
    
    
}