const config = require('config')

const emailsCount = {}

module.exports = async function(ctx, next) {
  if (!ctx.request.header['Justify-EMail']) { ctx.throw(401, 'Must be authenticated') }

  const email = ctx.request.header['Justify-EMail']
  const wordsCount = ctx.request.body ? ctx.request.body.split('\n').reduce((acc, lines) => acc + lines.split(' ').length, 0) : 0
  const emailWordsCount = emailsCount[email] ? emailsCount[email] : 0;
  if (wordsCount + emailWordsCount > config.limit) { ctx.throw(402, 'Payment required') }
  emailsCount[email] = wordsCount + emailWordsCount

  await next()
}
