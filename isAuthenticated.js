const jwt = require("jsonwebtoken")

async function isAuthenticated(req, res, next) {
    console.log(res.json);
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, "secret", (err, user) => {
        if (err) {
            return res.json({
                message: err
            })
        }
        else {
            req.user = user;
            next();
        }
    }
    )
}

module.exports = { isAuthenticated };