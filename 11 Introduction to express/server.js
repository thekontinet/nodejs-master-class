const express = require('express')
const http = require('http')
const datastore = require('./lib/datastore')
const helpers = require('./lib/helpers')

const app = express()

const server = http.createServer(app)

app.use(express.json())


app.get('/users', function(req, res){
    let {phone} = req.query
    phone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone : false

    if(!phone) return res.send({error: "Please provide a valid phone params"}, 400)

    datastore.find('users', phone, function(err, userData){
        if(err) res.send({error: err}, 400)

        delete userData.password

        res.send(userData, 200)
    })
})


app.post('/users', function(req, res){
    let {name, email, phone, password} = req.body
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
})


app.put('/users', function(req, res){
    let {name, email, phone, password} = req.body
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
})


app.delete('/users', function(req, res){
    let {phone} = req.query
    phone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone : false

    if(!phone) return res.send({error: "Please provide a valid phone params"}, 400)

    datastore.delete('users', phone, function(err){
        if(err) return res.send({error: 'User cannot be deleted'}, 400)
        res.send({message: 'successful'}, 200)
    })
})


server.listen(3000, function(){
    console.log('Server started at http://localhost:3000');
})
