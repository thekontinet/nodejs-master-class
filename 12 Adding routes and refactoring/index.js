const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const datastore = require('./lib/datastore')
const helpers = require('./lib/helpers')


const server = http.createServer(handler)

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

router._users = {}


router.notFound = function(req, res){
    res.send('Request was not found')
}


const routes = {
    get: {},
    post: {},
    put: {},
    delete: {}
}


routes.get.users = function(req, res){
    let {phone} = req.query
    phone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone : false

    if(!phone) return res.send({error: "Please provide a valid phone params"}, 400)

    datastore.find('users', phone, function(err, userData){
        if(err) res.send({error: err}, 400)

        delete userData.password

        res.send(userData, 200)
    })
}

routes.post.users = function(req, res){
    let {name, email, phone, password} = req.data
    name = typeof(name) === 'string' && name.trim().length > 0 ? name : false
    email = typeof(email) === 'string' && email.trim().length > 0 ? email : false
    phone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone : false
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false

    if((name && email && phone && password) === false){
        return res.send({error: "Please fill in correct information"}, 400)
    }

    const userCredentials = {name, email, phone, password: helpers.hash(password)}

    datastore.create('users', phone, userCredentials, function(err){
        if(err) return res.send({error: err}, 400)
        res.send({message: "successful"}, 201)
    })  
}

routes.put.users = function(req, res){
    let {name, email, phone, password} = req.data
    name = typeof(name) === 'string' && name.trim().length > 0 ? name : false
    email = typeof(email) === 'string' && email.trim().length > 0 ? email : false
    phone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone : false
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false

    if(!phone) return res.send({error: "Please provide a valid phone"}, 400)

    if((name || email || password) === false){
        return res.send({error: "Please provide a data to update"}, 400)
    }

    datastore.find('users', phone, function(err, userData){
        if(err) res.send({err: "data not found"}, 404)

        if(name) userData.name = name
        if(email) userData.email = email
        if(password) userData.password = helpers.hash(password)

        datastore.update('users', phone, userData, function(err){
            if(err) return res.send({error: err}, 400)
            res.send({message: 'successful'}, 200)
        })
    })
}

routes.delete.users = function(req, res){
    let {phone} = req.query
    phone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone : false

    if(!phone) return res.send({error: "Please provide a valid phone params"}, 400)

    datastore.delete('users', phone, function(err){
        if(err) return res.send({error: 'User cannot be deleted'}, 400)
        res.send({message: 'successful'}, 200)
    })
}







function handler(req, res){
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

        const requestObj = {
            path: requestPath,
            query: requestParams,
            method: requestMethod,
            data: requestData.length > 0 ? JSON.parse(requestData) : {}
        }

        const responseObj = {}
        responseObj.send = function(content, statusCode){
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200
            res.writeHead(statusCode, {
                'Content-Type': 'application/json'
            })
            res.end(JSON.stringify(content))
        }

        const requestHandler = typeof(routes[requestMethod][requestPath]) === 'function' ? routes[requestMethod][requestPath] : typeof(routes[requestMethod]['/' + requestPath]) === 'function' ? routes[requestMethod]['/' + requestPath] : null

        if(requestHandler !== null){
            requestHandler(requestObj, responseObj)
        }else{
            router.notFound(requestObj, responseObj)
        }
    })
}