import express, { type Router } from 'express'
import type { UrlController } from '../controllers/urlController'

export function createUrlRouter(urlController: UrlController): Router {
  const router = express.Router()

  router.get('/', urlController.renderHome)
  router.post('/shorten', urlController.shortenUrl)
  router.get('/:code', urlController.redirectShortUrl)

  return router
}
