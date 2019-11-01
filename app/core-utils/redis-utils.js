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

    return {
        redisClientSessionData: redisClient
    }


}