const JWT = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    
    const token = req.header('auth-token');
    
    
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }

    try {
        
        const data = JWT.verify(token, process.env.JWT_SECRETE); 
        
       
        req.webtoons = data.webtoons; 
        
       
        next();
    } catch (error) {
        
        return res.status(401).send({ error: "Invalid token, authentication failed" });
    }
};

module.exports = fetchuser;
