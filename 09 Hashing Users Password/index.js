const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const dataStore = require('./lib/datastore')
const helpers = require('./lib/helpers')

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

        // Find the request handler
        const requestHandler = typeof(routes[requestPath]) === 'function' ? routes[requestPath] : typeof(routes['/' + requestPath]) === 'function' ? routes['/' + requestPath] : null;

        const requestObj = {
            pathname: '/' + requestPath,
            method: requestMethod,
            query: requestQuery,
            data: requestMethod !== 'get' && requestData.length > 0 ? JSON.parse(requestData) : {}
        }

        const responseObj = {}

        responseObj.send = function(content, status){
            status = typeof(status) === 'number' ? status : 200;
            res.writeHead(status, {
                'Content-Type': 'application/json'
            })
            res.end(JSON.stringify(content))
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
    res.send('My Node js API')
}

routers.users = function(req, res){
    const allowedMethods = ['GET', 'POST', "PUT", "DELETE"]
    if(!allowedMethods.includes(req.method.toUpperCase())){
        return res.send({status: false, message:"Method not allowed"}, 405)
    }
    routers._users[req.method](req, res)
}

routers._users = {}

routers._users.post = function(req, res){
    const userData = req.data
    const name = typeof(userData.name) === 'string' && userData.name.trim().length > 0 ? userData.name : false
    const email = typeof(userData.email) === 'string' ? userData.email.trim() : false
    const phone = typeof(userData.phone) === 'string' && userData.phone.trim().length > 0 ? userData.phone : false
    const password = typeof(userData.password) === 'string' && userData.password.length >= 6 ? userData.password : false

    // Check that user information is not empty
    if((name && email && phone && password) === false){
        return res.send({status: false, message: "Please send all required fields"}, 400)
    }

    const userCredentials = {name, email, phone, password: helpers.hash(password)}

    // Save user data to storage
    dataStore.create('users', phone, userCredentials, function(err){
        if(err) return res.send({status: false, message: "Error: " + err}, 400)
        return res.send({status:true, message: 'Account created successfully'}, 201)
    })
}

// @todo user can only get their own record
routers._users.get = function(req, res){
    const phone = typeof(req.query.phone) == 'string' && req.query.phone.trim().length > 0 ? req.query.phone.trim() : false

    if(!phone) return res.send({status: false, message: "phone is required"}, 422)

    dataStore.read('users', phone, function(err, userData){
        if(err) return res.send({status: false, message: "Account not found"}, 404)

        delete userData.password
        res.send(userData)
    })
}

// @todo user can only update their own record
routers._users.put = function(req, res){
    const userData = req.data
    const name = typeof(userData.name) === 'string' && userData.name.trim().length > 0 ? userData.name : false
    const email = typeof(userData.email) === 'string' ? userData.email.trim() : false
    const phone = typeof(userData.phone) === 'string' && userData.phone.trim().length > 0 ? userData.phone : false
    const password = typeof(userData.password) === 'string' && userData.password.length >= 6 ? userData.password : false

    // Check that user information is not empty
    if(!phone){
        return res.send({status: false, message: "Please provide a phone number"}, 400)
    }

    // Check that user information is not empty
    if((name || email || password) === false){
        return res.send({status: false, message: "Please send all required fields"}, 400)
    }

    dataStore.read('users', phone, function(err, userCredentials){
        if(err) return res.send({status:false, message: 'Data not found'}, 400)

        // Update user information
        if(name) userCredentials.name = name
        if(email) userCredentials.email = email
        if(phone) userCredentials.phone = phone
        if(password) userCredentials.password = helpers.hash(password)
        
        // Updaate the new record to storage
        dataStore.update('users', phone, userCredentials, function(err){
            if(err) return res.send({status: false, message: "Error: " + err}, 400)
            res.send({status:true, message:'successful'}, 200)
        })
    })
}

// @todo user can only delete their own record
routers._users.delete = function(req, res){
    const phone = typeof(req.query.phone) == 'string' && req.query.phone.trim().length > 0 ? req.query.phone.trim() : false

    // Check that user information is not empty
    if(!phone){
        return res.send({status: false, message: "Please provide a phone number"}, 400)
    }

    // Delete record
    dataStore.delete('users', phone, function(err){
        if(err) return res.send({status: false, message: err}, 500)
        res.send({status: true, message: "Data deleted"}, 200)
    })
}

routers.notFound = function(req, res){
    res.send('Route does not exist', 404)
}

const routes = {
    '/': routers.welcome,
    '/users': routers.users,
}