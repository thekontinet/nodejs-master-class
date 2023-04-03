const express = require('express')
const router = express.Router()

const datastore = require('../lib/datastore')
const helpers = require('../lib/helpers')
const auth = require('../middlewares/auth')

// POST /tokens
router.post('/tokens', function(req, res){
    // Get the phone and password from request body
    let {phone, password} = req.body

    // validate users information
    phone = typeof(phone) === 'string' && phone.trim().length > 10 ? phone : false
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false

    // Respond with error if data is invalid
    if((phone && password) === false){
        return res.send({error: "Please fill in correct information"}, 400)
    }

    // Find the user record in our data store
    datastore.find('users', {phone}, function(err, userdata){
        console.log(userdata);
        //  Response with error if user was not found
        if(err) return res.send({error: "Invalid credentials"}, 400)

        // Hash the password sent by the client or user
        const hashedPassword = helpers.hash(password)
        // Validate the password by checking if the hash of the password in equal to the users passwor in data store
        if(hashedPassword !== userdata.password) return res.send({error: "Invalid credentials"}, 400)

        // Generate a new token
        const token = helpers.randomString(24)

        // Define a new token data
        const tokenData = {
            phone: phone,
            token: token,
            expireAt: Date.now() + 1000 * 60 * 60 * 24 * 7
        }

        // Store the new token data
        datastore.create('tokens', tokenData, function(err){
            if(err) return res.send({error: "Token failed. Please try again"})
            res.send({message: "success", data: tokenData})
        })
    })
})

// TODO: Check if token has expire before updating
router.put('/tokens', auth, function(req, res){
    // Get the token from request body
    let {token} = req.headers

    // Validate the token
    token = typeof(token) === 'string' && token.trim().length > 0 ? token : false

    // Check if the token is valid
    if(!token){
        return res.send({error: "Please provide a valid token"}, 400)
    }

    // Find the token, to know if it exists
    datastore.find('tokens', {token}, function(err, tokenData){
        // Check for error
        if(err || !tokenData) return res.send({error: "Please provide a valid token"}, 400)

        // Check if token has expired
        if(tokenData.expireAt < Date.now()){
            return res.send({error: "Token expired"}, 400)
        }

        // Create a new token data with updated info (expireAt)
        const newTokenData = {
            ...tokenData,
            expireAt: Date.now() + 1000 * 60 * 60 * 24 * 7
        }
        
        // Save the new token data to datastore
        datastore.update('tokens', {token}, newTokenData, function(err){
            if(err) return res.send({error: "token fail to extend"})
            res.send({message: "success", data: newTokenData})
        })
    })
})


router.delete('/tokens', function(req, res){
    /* Destructuring the token from the query object. */
    let {token} = req.headers
    token = typeof(token) === 'string' && token.trim().length > 0 ? token.trim() : false

    /* Checking if the token is valid. */
    if( token === false){
        return res.send({error: "Please enter valid token"}, 400)
    }

   /* Finding the token in the datastore */
    datastore.find('tokens', {token}, function(err, data){
        /* Checking if there is an error and if there is, it returns a response with the error message. */
        if(err || !data) return res.send({err: "Token not found"}, 400)

        /* Deleting the token from the datastore. */
        datastore.delete('tokens', {token}, function(err){
            if(err) return res.send({error: "Failed to delete token"})
            res.send({message: "successful"}, 200)
        })
    })
})


module.exports = router