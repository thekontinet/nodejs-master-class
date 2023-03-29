const datastore = require('../lib/datastore')

const auth = function(req, res, next){
    let {token} = req.headers
    token = typeof(token) === 'string' && token.trim().length > 0 ? token.trim() : false

    if(!token){
        return res.send({error: "Unauthorized"}, 401)
    }

    datastore.find('tokens', token, function(err, tokenData){
        if(err) return res.send({error: "Unauthorized"}, 401)

        if(tokenData.expiredAt < Date.now()){
            return res.send({error: "Token expired"}, 401)
        }

        req.userId = tokenData.phone
        next()
    })
}


module.exports = auth