const jwt = require('jsonwebtoken');

const memberAuth = (req, res, next) => {
    const authToken = req.header("x-auth-token");
    if(!authToken) {
        return res.status(401).json({
            msg: "No auth token, Access denied"
        });
    }
    let verified;
    try {
        verified = jwt.verify(authToken,process.env.SECRET);
    } catch (error) {
        return res.status(401).json({
            msg:"jwtToken: "+ error.message,
        });
    }
    if(!verified){
        return res.status(401).json({
            msg: "Access denied, not a valid token"
        });
    }

    req.user = verified;
    next();
}

const tellerAuth = (req, res, next) => {
    const authToken = req.header("x-auth-token");
    if(!authToken) {
        return res.status(401).json({
            msg: "No auth token, Access denied"
        });
    }
    let verified;
    try {
        verified = jwt.verify(authToken,process.env.SECRET);
    } catch (error) {
        return res.status(401).json({
            msg:"jwtToken: "+ error.message,
        });
    }
    if(!verified){
        return res.status(401).json({
            msg: "Access denied, not a valid token"
        });
    }

    if(verified.type != 'teller') {
        return res.status(401).json( {
            msg: "Access denied, not enough permissions"
        });
    }

    req.user = verified;
    next();
}


module.exports = {
    memberAuth,
    tellerAuth
}
