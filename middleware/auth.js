const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const authenticate = async(req, res, next)=>{
    try{
        console.log(req.header('authorization'));
        const token = req.header('authorization');
        
        console.log(token);
        if(!token) return res.status(401).json({success:false, message:'Token Missing & not authenticated'});
        const decodedUser = jwt.verify(token, 'secretKey');
        const userid = decodedUser.userId;
       //console.log('userId>>>>>', user.userId);
        const user =  await User.findOne({where: {id: userid}, attributes: {exclude: ['password']}});
            req.user = user;
            console.log(req.user, user);
            next();

    }catch (err){
        console.log(">>>>>>>>>>>>>>>",err);
        return res.status(401).json({success:"Not authenticated"});
    }
}

module.exports = {
    authenticate
};

//module.exports = authenticate;



