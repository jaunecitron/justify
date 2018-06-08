const config = require('config')
const jwt = require('jsonwebtoken')

module.exports.getToken = function(ctx) {
  const { email } = ctx.request.body
  const token = jwt.sign({ email }, config.auth.secret)
  ctx.status = 200
  ctx.body = token
}

const Ajv = require('ajv')
const ajv = new Ajv()
const validator = ajv.compile({
  properties: {
    email: { type: 'string', format: 'email' }
  },
  additionalProperties: false,
  required: ['email']
});

module.exports.validate = function(ctx, next) {
  if (validator(ctx.request.body)) {
    next()
  } else {
    ctx.throw(422, 'Bad payload')
  }
};
