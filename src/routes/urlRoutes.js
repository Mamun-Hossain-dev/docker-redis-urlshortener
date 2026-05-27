const express = require('express')

function createUrlRouter(urlController) {
  const router = express.Router()

  router.get('/', urlController.renderHome)
  router.post('/shorten', urlController.shortenUrl)
  router.get('/:code', urlController.redirectShortUrl)

  return router
}

module.exports = { createUrlRouter }
