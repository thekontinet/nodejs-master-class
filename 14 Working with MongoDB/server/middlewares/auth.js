const datastore = require('../lib/datastore')

const auth = function(req, res, next){
    let {token} = req.headers
    token = typeof(token) === 'string' && token.trim().length > 0 ? token.trim() : false

    if(!token){
        return res.send({error: "Unauthorized"}, 401)
    }

    datastore.find('tokens', {token}, function(err, tokenData){
        if(err) return res.send({error: "Unauthorized"}, 401)

        if(tokenData.expireAt && tokenData.expireAt > Date.now()){
            req.userId = tokenData.phone
            return next()
        }

        return res.send({error: "Token expired"}, 401)
    })
}


module.exports = auth