const Router = require('koa-router')
const router = new Router()

const auth = require('../../middlewares/auth')
const accessControl = require('../../middlewares/controlAccess')

router.post('/', auth, accessControl, require('./justify').justify)
router.post('/token', require('./getToken').validate, require('./getToken').getToken)

module.exports = router
