const crypto = require('crypto')

const lib = {}

lib.hash = function(str){
    const secret = 'my hashing secret'
    hashedValue = crypto.createHmac('sha256', secret).update(str).digest('hex')
    return hashedValue
}

module.exports = lib