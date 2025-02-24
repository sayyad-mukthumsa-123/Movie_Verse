const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.headers['x-token']; 
        console.log("Token: " + token);
        if (!token) {
            return res.status(400).json({ msg: "Token not found" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(400).json({ msg: "Error: " + error.message });
    }
};
