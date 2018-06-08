const chai = require('chai')
const expect = chai.expect
require('co-mocha')

const config = require('config')
const supertest = require('supertest')

const tokenRequest = supertest('http://localhost:8080/api/token')
const request = supertest('http://localhost:8080/api')

describe('justify : POST /api', () => {

  const mockText = `EOP
Ceci est un test de la mort qui tue qui doit faire forcément deux paragraphes et au moins quatre-vingt caractères par paragraphe pour pouvoir faire un test viable. EOP
On marque bien chaque fin de paragraphe par EOL qui nous servira de marqueur de fin. C'est pour nous garantir que si jamais une ligne contient un EOP
Comme ça si un EOP passe, pas de soucis si la ligne fait moins de quatre-vingt caractères, tout est normal. Ne panique pas. EOP`

  const mockTokenPayload = { email: 'email@gmail.com' }

  it('should succesfully respond a justified text', async () => {
    const token = (await tokenRequest.post('/').send(mockTokenPayload)).text
    const bearer = `Bearer ${token}`
    const response = await request.post('/')
      .send(mockText)
      .set({
        'Authorization': bearer,
        'Content-Type': 'text/plain'
      })
    console.log(response.error)
    expect(response.status).to.be.equal(200)
    const text = response.text
    const lines = text.split('\n')
    const endOfParagraph = /.*EOP/
    for (const line of lines) {
      if (line.match(endOfParagraph)) {
        expect(line.length <= 80).to.be.true
      } else {
        expect(line.length == 80).to.be.true
      }
    }
  })

  it('should fail with too much word text', async () => {
    const token = (await tokenRequest.post('/').send({ email: `limit${(new Date()).getTime()}@gmail.com` })).text
    const bearer = `Bearer ${token}`
    const requestNumber = Math.ceil(config.limit / 10000)
    const badText = 'a '.repeat(10000)
    let response
    for (let i = 1; i < requestNumber; i++) {
      response = await request.post('/')
        .send(badText)
        .set({
          'Authorization': bearer,
          'Content-Type': 'text/plain'
        })
      expect(response.status).to.be.equal(200)
    }

    response = await request.post('/')
      .send(badText)
      .set({
        'Authorization': bearer,
        'Content-Type': 'text/plain'
      })
    expect(response.status).to.be.equal(402)
  })
})
