const mongoose = require('mongoose')

const urlString = 'mongodb://localhost:27017'

mongoose.connect(urlString)
    .then(() => main())
    .catch((err) => console.log('Database Error: ' + err.message))

async function main(){
    const UserSchema = new mongoose.Schema({
        name: String,
        email: {
            type: String,
            required: [true, 'Email is needed']
        },
    })

    const UserModel = mongoose.model('User', UserSchema)

    const user = await UserModel.upda({email: 'sdsdf'})
    console.log(user);
}