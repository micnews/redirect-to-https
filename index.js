var httpToHttps = function (req, res) {
      if (!req.headers['x-forwarded-proto']) return false
      if (req.headers['x-forwarded-proto'] === 'https') return false

      var host = req.headers['x-forwarded-host'] || req.headers.host

      res.setHeader('location', 'https://' + host + req.url)
      res.statusCode = 301
      res.end()
    }

module.exports = httpToHttps