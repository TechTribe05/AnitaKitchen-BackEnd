const jwt = require("jsonwebtoken");


const validateUser = (req, res, next) => {
    try {
        // check if token exists
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided or invalid format" });
        }

        // grab token
        const token = req.headers.authorization.replace("Bearer ", "");

        // decode (use correct env variable)
        const decodedData = jwt.verify(token, process.env.SECRET);

        req.userData = decodedData;
        console.log("from middleware", decodedData);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed, Unauthorized token" });
    }
};

module.exports = validateUser;
