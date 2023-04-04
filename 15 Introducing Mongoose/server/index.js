const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

const server = http.createServer(function(req, res){
    const parsedUrl = url.parse(req.url, true)

    const requestPath = parsedUrl.pathname.replace(/^\/+|\/$/g, '')

    const requestParams = parsedUrl.query

    const requestMethod = req.method.toLowerCase()

    const decoder = new StringDecoder('utf-8')
    let requestData = ''

    req.on('data', function(chunk){
        const decodedData = decoder.write(chunk)
        requestData += decodedData
    })

    req.on('end', function(){
        requestData += decoder.end()

        console.log(requestData);

        const requestObj = {
            path: requestPath,
            query: requestParams,
            method: requestMethod,
            data: requestData
        }

        const responseObj = {}
        responseObj.send = function(content, statusCode){
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200
            res.writeHead(statusCode)
            res.end(content)
        }

        const requestHandler = typeof(routes[requestPath]) === 'function' ? routes[requestPath] : typeof(routes['/' + requestPath]) === 'function' ? routes['/' + requestPath] : null

        if(requestHandler){
            requestHandler(requestObj, responseObj)
        }else{
            router.notFound(requestObj, responseObj)
        }
    })
})

server.listen(3000, function(){
    console.log('Server started at http://localhost:3000');
})

const router = {}

router.welcome = function(req, res){
    const allowedMethods = ['GET']

    if(!allowedMethods.includes(req.method.toUpperCase())){
        return res.send('', 405)
    }

    res.send('Welcome to Node Js')
}

router.users = function(req, res){
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']
    if(!allowedMethods.includes(req.method.toUpperCase())){
        return res.send('', 405)
    }
    return router._users[req.method](req, res)
}

router._users = {}

router._users.get = function(req, res){
    res.send('This is users GET route')
}

router._users.post = function(req, res){
    res.send('This is users POST route')
}

router._users.put = function(req, res){
    res.send('This is users PUT route')
}

router._users.delete = function(req, res){
    res.send('This is users DELETE route')
}

router.notFound = function(req, res){
    res.send('Request was not found')
}

const routes = {
    '/': router.welcome,
    'users': router.users,
} 