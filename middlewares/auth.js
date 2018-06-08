const config = require('config')
const jwt = require('jsonwebtoken')

function getToken(ctx) {
  if (!ctx.header || !ctx.header.authorization) { return }

  const tokens = ctx.header.authorization.split(' ')
  if (tokens.length === 2) {
    const type = tokens[0]
    const token = tokens[1]
    if (type === 'Bearer') { return token }
  }
}

module.exports = async function(ctx, next) {
  const token = getToken(ctx)
  let resolvedToken

  if (!token) { ctx.throw(401, 'Must be authenticated') }

  try {
    resolvedToken = jwt.verify(token, config.auth.secret)
  } catch (e) { ctx.throw(401, 'Must be authenticated') }

  if (resolvedToken.email) {
    ctx.request.header['Justify-EMail'] = resolvedToken.email
    await next()
  } else { ctx.throw(401, 'Bad token') }
}
