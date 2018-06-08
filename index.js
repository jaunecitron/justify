'use strict'

const config = require('config')
const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const app = new Koa()

app.use(require('./middlewares/healthcheck'))

const router = new Router()
const justifyRouter = require('./routes/justify')
router.use('/api', justifyRouter.routes(), justifyRouter.allowedMethods())

app.use(koaBody())
app.use(bodyParser())
app.use(router.routes())

app.listen(
  config.server.port || 80,
  config.server.host || '0.0.0.0',
  console.log(`Server listening on ${process.env.HOST || config.server.host || '0.0.0.0'}:${process.env.PORT || config.server.port || 80}`)
)

// const justify = require('./lib/justify').justify
// const text = 'Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint. '
// console.log(justify(text))
