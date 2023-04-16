const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true
    },

    user:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },

    expiredAt:{
        type: Date,
        required: true
    }
})

TokenSchema.methods.toJSON = function(){
    const token = this.toObject()
    token.id = token._id
    return token
}

const TokenModel = mongoose.model('Token', TokenSchema)

module.exports = TokenModel