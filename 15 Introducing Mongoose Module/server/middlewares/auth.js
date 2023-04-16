const datastore = require('../lib/datastore')
const TokenModel = require('../models/token-model')

const auth = async function(req, res, next){
    let {token} = req.headers
    token = typeof(token) === 'string' && token.trim().length > 0 ? token.trim() : false

    if(!token){
        return res.send({error: "Unauthorized"}, 401)
    }

    const tokenData = await TokenModel.findOne({token})

    if(!tokenData){
        return res.status(401).send({error: "Unauthorized"})
    }

    if(tokenData.expiredAt < Date.now()){
        return res.status(401).send({error: "Unauthorized"})
    }
    
    req.userId = tokenData.user
    return next()
}


module.exports = auth