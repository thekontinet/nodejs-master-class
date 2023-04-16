const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    phone:{
        type: String,
        required: true,
        min: [11, 'Phone should be upto 11 characters'],
        max: [14, 'Phone should not be more than 14 characters'],
    },

    password:{
        type: String,
        required: true
    }
})

UserSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password
    user.id = user._id
    return user
}

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel