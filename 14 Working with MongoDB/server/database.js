const {MongoClient} = require('mongodb')

const urlString = 'mongodb://localhost:27017'
const client = new MongoClient(urlString)


async function main(){
    await client.connect()

    const db = client.db('note-app')
    const collection = db.collection('users')

    // const result = await collection.insertOne({
    //     name: 100,
    //     email: "john@email.com"
    // })

    // console.log(result);

    // const users = await collection.find().toArray()

    // console.log(users);

    await collection.deleteOne({name: 100})
}

main()