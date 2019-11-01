const dataUtils = require("../core-utils").DataUtils;
const redisUtils = require('../core-utils').RedisUtils;

const redisConf = require('../core-utils').redisConfig;

let redisClient = redisUtils.initRedisConnection({
    sessionData: redisConf
})

const login = async (req, res) => {
    try {
        console.log(req);
        res.status(200).send(req.body)
    } catch (err) {

    }
}

const authenticationGaurd = async (req, res, next) => {
    try {
        if (req.headers.authenticated)
            return next();

        res.redirect('/');
    } catch (err) {

    }
}

const loginFunctions = {};
loginFunctions.login = login;
loginFunctions.authenticationGaurd = authenticationGaurd;
module.exports = loginFunctions;