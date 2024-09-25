 const { verifyToken } = require("../services/authenticate")

function checkUserAuthentication (cookieName) {
    return function (req,res,next)  {
        const tokenCookieValue = req.cookies[cookieName]
        if(!tokenCookieValue) {
           return next()
        }

        try {
            const userPayload = verifyToken(tokenCookieValue);
            req.user = userPayload;
            
        } catch (error) {}

        return next();
    }

}

module.exports = {
    checkUserAuthentication,
}