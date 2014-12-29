var http = require('http')

  , servertest = require('servertest')
  , test = require('tape')

  , toHttps = require('./index')

  , server = http.createServer(function (req, res) {
      if (toHttps(req, res)) return

      res.end('beep boop')
    })

  , setupServer = function (headers, callback) {
      var options = { encoding: 'utf8', headers: headers }

      servertest(server, '/hello?foo=bar', options, callback)
    }

test('no x-forwarded-proto header', function (t) {
  setupServer({}, function (err, res) {
    if (err) return t.end(err)

    t.equal(res.statusCode, 200)
    t.equal(res.body, 'beep boop')
    t.end()
  })
})

test('x-forwarded-proto=https', function (t) {
  setupServer({ 'x-forwarded-proto': 'https' }, function (err, res) {
    if (err) return t.end(err)

    t.equal(res.statusCode, 200)
    t.equal(res.body, 'beep boop')
    t.end()
  })
})

test('x-forwarded-proto=http', function (t) {
  var headers = {
        'x-forwarded-proto': 'http'
      }

  setupServer(headers, function (err, res) {
    if (err) return t.end(err)

    t.equal(res.statusCode, 301)
    t.ok(/^https:\/\/localhost:\d+\/hello\?foo=bar$/.test(res.headers.location))
    t.end()
  })
})

test('x-forwarded-proto=http, x-forwarded-host=example.com', function (t) {
  var headers = {
          'x-forwarded-proto': 'http'
        , 'x-forwarded-host': 'example.com'
      }

  setupServer(headers, function (err, res) {
    if (err) return t.end(err)

    t.equal(res.statusCode, 301)
    t.equal(res.headers.location, 'https://example.com/hello?foo=bar')

    t.end()
  })
})
