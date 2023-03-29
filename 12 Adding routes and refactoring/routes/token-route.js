const express = require('express')
const router = express.Router()

const datastore = require('../lib/datastore')
const helpers = require('../lib/helpers')

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
    datastore.find('users', phone, function(err, userdata){
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
        datastore.create('tokens', token, tokenData, function(err){
            if(err) return res.send({error: "Token failed. Please try again"})
            res.send({message: "success", data: tokenData})
        })
    })
})

router.put('/tokens', function(req, res){
    // Get the token from request body
    let {token} = req.body

    // Validate the token
    token = typeof(token) === 'string' && token.trim().length > 0 ? token : false

    // Check if the token is valid
    if(!token){
        return res.send({error: "Please provide a valid token"}, 400)
    }

    // Find the token, to know if it exists
    datastore.find('tokens', token, function(err, tokenData){
        // Check for error
        if(err) return res.send({error: "Please provide a valid token"}, 400)

        // Create a new token data with updated info (expireAt)
        const newTokenData = {
            ...tokenData,
            expireAt: Date.now() + 1000 * 60 * 60 * 24 * 7
        }
        
        // Save the new token data to datastore
        datastore.update('tokens', token, newTokenData, function(err){
            if(err) return res.send({error: "token fail to extend"})
            res.send({message: "success", data: newTokenData})
        })
    })
})


router.delete('/tokens', function(req, res){
    /* Destructuring the token from the query object. */
    let {token} = req.query
    token = typeof(token) === 'string' && token.trim().length > 0 ? token.trim() : false

    i/* Checking if the token is valid. */
    if( token === false){
        return res.send({error: "Please enter valid token"}, 400)
    }

   /* Finding the token in the datastore */
    datastore.find('tokens', token, function(err, data){
        /* Checking if there is an error and if there is, it returns a response with the error message. */
        if(err) return res.send({err: "Token not found"}, 400)

        /* Deleting the token from the datastore. */
        datastore.delete('tokens', token, function(err){
            if(err) return res.send({error: "Failed to delete token"})
            res.send({message: "successful"}, 200)
        })
    })
})


module.exports = router