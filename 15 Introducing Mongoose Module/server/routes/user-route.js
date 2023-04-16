const express = require('express')
const datastore = require('../lib/datastore')
const helpers = require('../lib/helpers')
const auth = require('../middlewares/auth')
const UserModel = require('../models/user-model')
const TokenModel = require('../models/token-model')

const router = express.Router()



router.get('/users', auth, async function(req, res){
    let id = req.userId
    const user = await UserModel.findById(id)
    res.status(200).send({status: true, data: user})
})

router.post('/users', async function(req, res){
    let {name, email, phone, password} = req.body
    name = typeof(name) === 'string' && name.trim().length > 0 ? name : false
    email = typeof(email) === 'string' && email.trim().length > 0 ? email : false
    phone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone : false
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false

    if((name && email && phone && password) === false){
        return res.send({error: "Please fill in correct information"}, 400)
    }

    const userCredentials = {name, email, phone, password: helpers.hash(password)}

    const user = await UserModel.create(userCredentials)

    res.status(201).send({status: 'true', data: user})
})

router.put('/users', auth, async function(req, res){
    let {name, email, password} = req.body
    name = typeof(name) === 'string' && name.trim().length > 0 ? name : false
    email = typeof(email) === 'string' && email.trim().length > 0 ? email : false
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false

    let id = req.userId

    if((name || email || password) === false){
        return res.send({error: "Please provide a data to update"}, 400)
    }

    const user = await UserModel.findById(id)

    if(!user) return res.sendStatus(404).send({status: false, message: 'Account not found'})

    if(name) user.name = name
    if(email) user.email = email
    if(password) user.password = helpers.hash(password)

    await user.save()

    res.status(200).send({status: true, data: user})
})


router.delete('/users', auth, async function(req, res){
    id = req.userId

    await UserModel.deleteOne({_id: id});
    await TokenModel.deleteMany({user: req.userId})

    res.status(200).send({status: true, data: {}})
})





module.exports = router