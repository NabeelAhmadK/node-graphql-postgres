const dataUtils = require("../core-utils").DataUtils;
const dbUtils = require('../core-utils').DBUtils;
const redisUtils = require('../core-utils').RedisUtils;
const defs = require('./defs');
const redisConf = require('../core-utils').redisConfig;
const authFunction = require('../mw-dal').AuthFunction;

let redisClient = redisUtils.initRedisConnection({
    sessionData: redisConf
})

const login = async (req, res) => {
    let tranx = null;
    const httpResObj = {};
    const sessionObj = {};
    try {

        tranx = await dbUtils.beginTransaction();


        let options = {
            tranx: tranx,
            user_name: req.body.userName,
            password: req.body.password
        }

        sessionObj.user = await authFunction.loginUser(options);

        httpResObj.tokenType = defs.TokenTypes.BEARER;
        httpResObj.expires_in = '7200';
        httpResObj.refresh_token = dataUtils.generateToken(4, 8);
        httpResObj.access_token = dataUtils.generateToken(4, 8);
        sessionObj.expiry = Date.now() + httpResObj.expires_in * 1000
        httpResObj.data = sessionObj;

        await redisUtils.setAccessTokenDataByAccessTokenPromise({
            redisClient: redisClient,
            accessToken: httpResObj.access_token,
            tokenData: httpResObj
        })

        await redisUtils.setAccessTokenByRefreshTokenPromise({
            redisClient: redisClient,
            accessToken: httpResObj.access_token,
            refreshToken: httpResObj.refresh_token
        });


        await redisUtils.setAccessTokenExpiryPromise({
            redisClient: redisClient,
            accessToken: httpResObj.access_token,
            expiry: sessionObj.expiry
        });
        res.status(200).send(httpResObj)
    } catch (err) {
        console.log(err);
        res.status(500).send(err)
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