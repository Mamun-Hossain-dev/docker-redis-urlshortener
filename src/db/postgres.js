const { Pool } = require('pg')

function createDbPool(dbConfig) {
  return new Pool(dbConfig)
}

module.exports = { createDbPool }
