const { createClient } = require('redis')

function createRedisClient(redisConfig) {
  return createClient({
    socket: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
    password: redisConfig.password,
  })
}

module.exports = { createRedisClient }
