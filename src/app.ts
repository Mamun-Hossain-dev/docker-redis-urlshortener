import express, { type Router } from 'express'
import path from 'path'

export function createApp(urlRouter: Router) {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static(path.join(__dirname, '..', 'public')))

  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, '..', 'views'))

  app.use('/', urlRouter)

  return app
}
