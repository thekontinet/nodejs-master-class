const crypto = require('crypto')

const lib = {}


lib.hash = function(str){
    const hashKey = 'mysecret'
    return crypto.createHmac('sha256', hashKey).update(str).digest('hex')
}




module.exports = lib