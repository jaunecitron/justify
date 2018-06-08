require('co-mocha')

describe('Justify API', () => {
  require('./justify/token.test')
  require('./justify/justify.test')
})
