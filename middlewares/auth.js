const route = require("../routes/route");
const jwt = require("jsonwebtoken");
const jwtSecretKey = 'thorium@group8';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if(!token){
      return res.status(400).json({status:false, msg:`Authentication Token Missing`});
    }
    const splitToken = token.split(' ');

    if(splitToken.length !== 2|| splitToken[0] !== 'Bearer'|| !splitToken[1]){
      return res.status(403).json({status:false, msg:`Invalid Token Format`});
    }
    const decoded = await jwt.verify(splitToken[1], jwtSecretKey);

    if(!decoded){
      return res.status(403).json({status:false, msg:`Invalid Authentication Token in Request`});
    }

    if(decoded.userId !== req.params.userId){
      return res.status(403).json({status:false, msg:`Unathorised Access`});
    }

    req.userId = decoded.userId;
    req.token = splitToken[1];

    next();



  } catch (error) {
    return res.status(500).json({status:false, msg: error.message});
  }
};

module.exports = {
  auth,
};






