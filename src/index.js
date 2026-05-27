const { getConfig } = require('./config')
const { createDbPool, ensureSchema } = require('./db/postgres')
const { createRedisClient } = require('./db/redis')
const { createUrlService } = require('./services/urlService')
const { createUrlController } = require('./controllers/urlController')
const { createUrlRouter } = require('./routes/urlRoutes')
const { createApp } = require('./app')

async function startServer() {
  const config = getConfig()
  const pool = createDbPool(config.db)
  const redis = createRedisClient(config.redis)

  await ensureSchema(pool)

  redis.connect().catch((error) => {
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
