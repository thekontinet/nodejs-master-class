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

    const requestHandler = typeof(routes[requestPath]) === 'function' ? routes[requestPath] : typeof(routes['/' + requestPath]) === 'function' ? routes['/' + requestPath] : null;

    if(!requestHandler){
        return routers.notFound(req, res)
    }

    requestHandler(req, res)
})

// Set server to listen to a port
server.listen(3000, function(){
    console.log(`Server runing at http://127.0.0.1:3000`);
})

const routers = {}

routers.welcome = function(req, res){
    res.end('Hello World')
}

routers.users = function(req, res){
    res.end('This is the user route')
}

routers.notFound = function(req, res){
    res.end('Route does not exist')
}

const routes = {
    '/': routers.welcome,
    '/users': routers.users,
}