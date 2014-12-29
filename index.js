var redirectToHttps = function (req, res) {
      if (!req.headers['x-forwarded-proto']) return false
      if (req.headers['x-forwarded-proto'] === 'https') return false

      var host = req.headers['x-forwarded-host'] || req.headers.host

      res.setHeader('location', 'https://' + host + req.url)
      res.statusCode = 301
      res.end()
      return true
    }

module.exports = redirectToHttps