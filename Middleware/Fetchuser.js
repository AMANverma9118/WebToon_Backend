const JWT = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    // Get the token from the request header
    const token = req.header('auth-token');
    
    // Check if token exists
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }

    try {
        // Verify the token using the JWT secret key
        const data = JWT.verify(token, process.env.JWT_SECRETE); // Make sure 'JWT_SECRET' is set in your environment
        
        // Attach the webtoons data extracted from the token to the request object
        req.webtoons = data.webtoons;  // Assigning the webtoons field from the JWT payload to req.webtoons
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle invalid or expired token
        return res.status(401).send({ error: "Invalid token, authentication failed" });
    }
};

module.exports = fetchuser;
