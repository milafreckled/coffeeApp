const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const withAuth = (req, res, next) => {
    const { token } = req.cookies;
    if (!token){
        res.status(401).send('Unauthorized. No token provided')
    }else{
        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                res.status(401).send('Unauthorized. Invalid token')
            }else{
                req.data = decoded;
                next()
            }
        })
    }
}
module.exports = withAuth;