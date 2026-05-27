import { createClient, type RedisClientType } from 'redis'
import type { RedisConfig } from '../config'

export function createRedisClient(redisConfig: RedisConfig): RedisClientType {
  return createClient({
    socket: {
      host: redisConfig.host,
      port: redisConfig.port ? Number(redisConfig.port) : undefined,
    },
    password: redisConfig.password,
  })
}
