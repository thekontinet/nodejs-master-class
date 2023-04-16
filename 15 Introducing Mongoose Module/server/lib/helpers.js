const crypto = require('crypto')

const lib = {}


lib.hash = function(str){
    /* Creating a variable called hashKey and setting it to a string. */
    const hashKey = 'mysecret'
    /* Creating a hash of the string. */
    return crypto.createHmac('sha256', hashKey).update(str).digest('hex')
}


/* Creating a random string of characters. */
lib.randomString =  function(length){
    /* Creating a string of characters that will be used to create a random string of characters. */
    let chars = '1234567890abcdefghijklmnopqrstuvwxyz'
    /* Creating a variable called token and setting it to an empty string. */
    let token = ''

    /* Creating a random string of characters. */
    for(let x = 0; x < length; x++){
        /* Creating a random number between 0 and the length of the string of characters. */
        let randomPosition = Math.floor(Math.random() * chars.length)
        /* Getting a single character from the string of characters. */
        let singleChar = chars.at(randomPosition)
        /* Adding the single character to the token. */
        token += singleChar
    }

    /* Returning the token. */
    return token
}




module.exports = lib