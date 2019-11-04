const redis = require("redis");

var RedisUtils = {};

module.exports.RedisUtils = RedisUtils;

RedisUtils.initRedisConnection = (redisConf) => {

    let redisClient;
    if (redisConf.sessionData) {
        let redisSessionDataConf = redisConf.sessionData;
        redisClient = redis.createClient(redisConf.port, redisConf.host, {
            enable_offline_queue: redisConf.offlineQueue
        })

        redisClient.on("error", function (err) {
            logger.error("redisClientSessionData Error " + err);
        });
    }

    return redisClient;

}

RedisUtils.getAccessTokenDataByAccessTokenPromise = async (reqData) => {
    try {
        const redisToken = reqData.redisClient.hget('access-tokens', reqData.accessToken);
        return redisToken;
    } catch (err) {
        throw err;
    }
}

RedisUtils.setAccessTokenDataByAccessTokenPromise = async (reqData) => {

    try {
        const redisToken = await reqData.redisClient.hset('access-tokens', reqData.accessToken, JSON.stringify(reqData.tokenData));
        return redisToken;
    } catch (err) {
        throw err;
    }

}


RedisUtils.setAccessTokenByRefreshTokenPromise = function (reqData) {
    return new Promise(function (resolve, reject) {
        reqData.redisClient.hset('refresh-tokens', reqData.refreshToken, reqData.accessToken, function (err, respObj) {
            if (err) {
                reject(err);
            } else {
                resolve(respObj);
            }
        });
    });
}

RedisUtils.getAccessTokenByRefreshTokenPromise = function (reqData) {
    return new Promise(function (resolve, reject) {
        reqData.redisClient.hget('refresh-tokens', reqData.refreshToken, function (err, respObj) {
            if (err) {
                reject(err);
            } else {
                resolve(respObj);
            }
        });
    });
}

RedisUtils.delAccessTokenByRefreshTokenPromise = function (reqData) {
    return new Promise(function (resolve, reject) {
        reqData.redisClient.hdel('refresh-tokens', reqData.refreshToken, function (err, respObj) {
            if (err) {
                reject(err);
            } else {
                resolve(respObj);
            }
        });
    });
}

RedisUtils.getTokenExpiryPromise = function (reqData) {
    return new Promise(function (resolve, reject) {
        reqData.redisClient.zscore('access-tokens-expiry', reqData.accessToken, function (err, respObj) {
            if (err) {
                reject(err);
            } else {
                resolve(respObj);
            }
        });
    });
}

RedisUtils.setAccessTokenExpiryPromise = function (reqData) {
    return new Promise(function (resolve, reject) {
        reqData.redisClient.zadd('access-tokens-expiry', reqData.expiry, reqData.accessToken, function (err, respObj) {
            if (err) {
                reject(err);
            } else {
                resolve(respObj);
            }
        });
    });
}

RedisUtils.remAccessTokenExpiryPromise = function (reqData) {
    return new Promise(function (resolve, reject) {
        reqData.redisClient.zrem('access-tokens-expiry', reqData.accessToken, function (err, respObj) {
            if (err) {
                reject(err);
            } else {
                resolve(respObj);
            }
        });
    });
}