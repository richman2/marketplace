import { redisClient } from "../../main.js";

class Redis {
  constructor() {}
  async findInRedis(obj) {
    if (obj.uniqueId) return JSON.parse(await redisClient.get(`${obj.ModelName}:${obj.uniqueId}`));
    return JSON.parse(await redisClient.get(obj.ModelName));
  }
  setInRedis(obj) {
    if (obj.uniqueId)
      return redisClient.set(`${obj.ModelName}:${obj.uniqueId}`, JSON.stringify(obj.data), "EX", obj.exTime);
    return redisClient.set(`${obj.ModelName}`, JSON.stringify(obj.data), "EX", obj.exTime);
  }
  deleteByKey(obj) {
    if (obj.uniqueId) {
      return redisClient.del(`${obj.ModelName}:${obj.uniqueId}`);
    }
    return redisClient.del(`${obj.ModelName}`);
  }
}

export default new Redis();
