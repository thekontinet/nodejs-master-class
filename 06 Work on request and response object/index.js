const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

// Creating a simple server that respond with hello world
const server = http.createServer(function(req, res){
    const parsedUrl = url.parse(req.url, true)

    // Get the request path sent by the client
    const requestPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')

    // Get the request parameters sent by the client
    const requestQuery = parsedUrl.query

    // Get the request method
    const requestMethod = req.method.toLowerCase()

    // Create a new decoder object to decode the POST data from buffer to string
    const decoder = new StringDecoder('utf-8')

    // Create and empty string to store the decoded buffer
    let requestData = ''

    // Listen for new POST data and process them
    req.on('data', function(dataBuffer){
        // Convert the buffer to string and update the requestData variable
        const bufferString = decoder.write(dataBuffer)
        requestData += bufferString
    })

    // This event will be called when all POST data has been sent
    // Request should only proceed after post data has been written
    req.on('end', function(){
        // Convert any remaining buffer to string and update the requestData variable
        const bufferString = decoder.end()
        requestData += bufferString

        // Print data to console
        console.log(requestData);

        // Find the request handler
        const requestHandler = typeof(routes[requestPath]) === 'function' ? routes[requestPath] : typeof(routes['/' + requestPath]) === 'function' ? routes['/' + requestPath] : null;

        const requestObj = {
            pathname: '/' + requestPath,
            method: requestMethod,
            query: requestQuery,
            data: requestData
        }

        const responseObj = {}
        responseObj.send = function(content){
            return res.end(content)
        }

        // Call the request handler if it exist, else call the notFound handler.
        if(requestHandler){
            requestHandler(requestObj, responseObj)
        }else{
            routers.notFound(req, res)
        }
    })
})

// Set server to listen to a port
server.listen(3000, function(){
    console.log(`Server runing at http://127.0.0.1:3000`);
})

const routers = {}

routers.welcome = function(req, res){
    res.send('Hello World')
}

routers.users = function(req, res){
    res.send('This is the user route')
}

routers.notFound = function(req, res){
    res.send('Route does not exist')
}

const routes = {
    '/': routers.welcome,
    '/users': routers.users,
}