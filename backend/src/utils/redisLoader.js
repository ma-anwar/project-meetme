/* eslint-disable no-console */
import Redis from "ioredis";

const getRedisClient = () => {
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

    return redisClient;
};
export default getRedisClient;
