/* eslint-disable no-console */
const Redis = require("ioredis");

const redisClient = new Redis("redis");

redisClient.on("connect", () => {
    console.log("Redis: succesfully connected");
});

redisClient.on("error", (err) => {
    console.log(`Redis: Error ${err} `);
});

redisClient.on("reconnecting", () => {
    console.log("Redis: Reconnecting. ");
});

exports.redisClient = redisClient;
