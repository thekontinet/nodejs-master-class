const express = require('express')
const router = express.Router()

const datastore = require('../lib/datastore')
const helpers = require('../lib/helpers')
const auth = require('../middlewares/auth')
const TokenModel = require('../models/token-model')
const UserModel = require('../models/user-model')

// POST /tokens
router.post('/tokens', async function(req, res){
    // Get the phone and password from request body
    let {phone, password} = req.body

    // validate users information
    phone = typeof(phone) === 'string' && phone.trim().length > 10 ? phone : false
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false

    // Respond with error if data is invalid
    if((phone && password) === false){
        return res.send({error: "Please fill in correct information"}, 400)
    }

    const user = await UserModel.findOne({phone})

    if(!user) return res.status(400).send({error: "Invalid Credentials"})

    if(user.password !== helpers.hash(password)) return res.status(400).send({error: "Invalid Credentials"})

    // Generate a new token
    const token = helpers.randomString(24)

    const tokenData = await TokenModel.create({
        user: user._id,
        token,
        expiredAt: Date.now() + 1000 * 60 * 60 * 24 * 7
    })

    res.status(201).send({status: true, data: tokenData})
})


router.put('/tokens', auth, async function(req, res){
    // Get the token from request body
    let {token} = req.headers

    // Validate the token
    token = typeof(token) === 'string' && token.trim().length > 0 ? token : false

    // Check if the token is valid
    if(!token){
        return res.send({error: "Please provide a valid token"}, 400)
    }

    const tokenData = await TokenModel.findOne({token})

    tokenData.expiredAt = Date.now() + 1000 * 60 * 60 * 24 * 7
    await tokenData.save()

    res.status(200).send({status: true, data: tokenData})
})


router.delete('/tokens', async function(req, res){
    /* Destructuring the token from the query object. */
    let {token} = req.headers
    token = typeof(token) === 'string' && token.trim().length > 0 ? token.trim() : false

    /* Checking if the token is valid. */
    if( token === false){
        return res.send({error: "Please enter valid token"}, 400)
    }

    const tokenData = await TokenModel.findOne({token})

    await tokenData.deleteOne()

    res.status(200).send({status: true})
})


module.exports = router