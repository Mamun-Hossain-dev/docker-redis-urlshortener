import { createApp } from './app'
import { getConfig } from './config'
import { createUrlController } from './controllers/urlController'
import { createDbPool, ensureSchema } from './db/postgres'
import { createRedisClient } from './db/redis'
import { createUrlRouter } from './routes/urlRoutes'
import { createUrlService } from './services/urlService'

async function startServer(): Promise<void> {
  const config = getConfig()
  const pool = createDbPool(config.db)
  const redis = createRedisClient(config.redis)

  await ensureSchema(pool)

  redis.connect().catch((error: Error) => {
    console.error('Redis connection failed:', error.message)
  })

  const urlService = createUrlService(pool, redis)
  const urlController = createUrlController(urlService, config.baseUrl)
  const urlRouter = createUrlRouter(urlController)
  const app = createApp(urlRouter)

  app.listen(config.port, () => {
    console.log(`Running on port ${config.port}`)
  })
}

startServer()
