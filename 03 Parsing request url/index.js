const http = require('http')
const url = require('url')

// Creating a simple server that respond with hello world
const server = http.createServer(function(req, res){
    const parsedUrl = url.parse(req.url, true)

    // Get the request path sent by the client
    const requestPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')

    // Get the request parameters sent by the client
    const requestQuery = parsedUrl.query

    const requestMethod = req.method.toLowerCase()

    res.end(`Client is requesting /${requestPath} using "${requestMethod.toUpperCase()}" method with the following params ${JSON.stringify(requestQuery)}`)
})

// Set server to listen to a port
server.listen(3000, function(){
    console.log(`Server runing at http://127.0.0.1:3000`);
})