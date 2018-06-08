const justify = require('../../lib/justify').justify

module.exports.justify = function(ctx) {
  if (typeof ctx.request.body !== 'string') { ctx.throw(422, 'Must post a text/plain') }

  ctx.status = 200
  ctx.body = justify(ctx.request.body)
}
