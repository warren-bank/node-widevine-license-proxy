const http = require('http')

const start_server = function(app, {port}) {
  if (!port || isNaN(port)) port = 80

  const server = http.createServer(app)

  server.listen(port, function () {
    console.log(`HTTP server is listening on port: ${port}`)
  })

  return server
}

module.exports = start_server
