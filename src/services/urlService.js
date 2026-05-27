const { nanoid } = require('nanoid')

function createUrlService(pool, redis) {
  async function getRecentLinks() {
    const recent = await pool.query(
      `SELECT short_code, original_url, created_at, click_count
       FROM urls
       ORDER BY created_at DESC
       LIMIT 10`
    )
    return recent.rows
  }

  async function generateUniqueCode() {
    let shortCode = nanoid(6)
    let exists = true

    while (exists) {
      const found = await pool.query('SELECT 1 FROM urls WHERE short_code = $1', [shortCode])
      exists = found.rows.length > 0
      if (exists) {
        shortCode = nanoid(6)
      }
    }

    return shortCode
  }

  async function createShortUrl(originalUrl, customAlias) {
    const shortCode = customAlias || (await generateUniqueCode())
    await pool.query(
      'INSERT INTO urls (short_code, original_url) VALUES ($1, $2)',
      [shortCode, originalUrl]
    )
    return shortCode
  }

  async function resolveShortCode(code) {
    const cached = await redis.get(code)
    if (cached) {
      return cached
    }

    const result = await pool.query(
      'SELECT original_url FROM urls WHERE short_code = $1',
      [code]
    )

    if (result.rows.length === 0) {
      return null
    }

    const originalUrl = result.rows[0].original_url
    await pool.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
      [code]
    )
    await redis.setEx(code, 3600, originalUrl)
    return originalUrl
  }

  return {
    getRecentLinks,
    createShortUrl,
    resolveShortCode,
  }
}

module.exports = { createUrlService }
