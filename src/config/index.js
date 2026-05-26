function getConfig() {
  const port = process.env.PORT || 3000
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`

  return {
    port,
    baseUrl,
    db: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  }
}

module.exports = { getConfig }
