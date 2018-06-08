const chai = require('chai')
const expect = chai.expect
require('co-mocha')

const supertest = require('supertest')

const request = supertest('http://localhost:8080/api/token')

describe('token : POST /api/token', () => {

  const mockPayload = { email: 'email@gmail.com' }

  it('should fail get token with email less payload', async () => {
    const payload = Object.assign({}, mockPayload)
    delete payload.email

    const response = await request.post('/').send(payload)
    expect(response.status).to.be.equal(422)
    expect(response.error.text).to.be.equal('Bad payload')
  })

  it('should fail get token with useless fields payload', async () => {
    const payload = Object.assign({}, mockPayload)
    payload.bullshit = 'hello'

    const response = await request.post('/').send(payload)
    expect(response.status).to.be.equal(422)
    expect(response.error.text).to.be.equal('Bad payload')
  })

  it('should successfully get token', async () => {
    const payload = Object.assign({}, mockPayload)

    const response = await request.post('/').send(payload)
    expect(response.status).to.be.equal(200)
    expect(response.text).to.be.an('string')
  })

})
