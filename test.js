var http = require('http')

  , servertest = require('servertest')
  , test = require('tape')

  , toHttps = require('./index')

  , server = http.createServer(function (req, res) {
      if (toHttps(req, res)) return

      res.end('beep boop')
    })

  , setupServer = function (headers, callback) {
      servertest(server, '/', { encoding: 'utf8', headers: headers }, callback)
    }

test('no x-forwarded-proto header', function (t) {
  setupServer({}, function (err, res) {
    if (err) return t.end(err)

    t.equal(res.statusCode, 200)
    t.equal(res.body, 'beep boop')
    t.end()
  })
})
