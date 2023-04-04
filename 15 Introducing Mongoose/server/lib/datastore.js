const {MongoClient} = require('mongodb')
const urlString = 'mongodb://localhost:27017'
const client = new MongoClient(urlString)

const database = 'note-app'

const lib = {}

lib.create = function(collection, content, callback){
    client.connect()
        .then(client => {
            const db = client.db(database)
            const col = db.collection(collection)
            return col.insertOne(content)
        })
        .then(() => callback(false))
        .catch(err => callback(err.message))
}

lib.find = function(collection, reference, callback){
    client.connect()
        .then(client => {
            const db = client.db(database)
            const col = db.collection(collection)
            return col.findOne(reference)
        })
        .then((result) => {
            callback(false, result)
        })
        .catch(err => {
            callback(err.message)
        })
}

lib.findAll = function(collection, reference, callback){
    client.connect()
        .then(client => {
            const db = client.db(database)
            const col = db.collection(collection)
            return col.find(reference).toArray()
        })
        .then((result) => {
            callback(false, result)
        })
        .catch(err => {
            callback(err.message)
        })
}

lib.update = function(collection, reference, content, callback){
    client.connect()
    .then(client => {
        const db = client.db(database)
        const col = db.collection(collection)
        return col.updateOne(reference, {$set:{...content}})
    })
    .then(() => callback(false))
    .catch(err => callback(err.message))
}

lib.delete = function(collection, reference, callback){
    client.connect()
    .then(client => {
        const db = client.db(database)
        const col = db.collection(collection)
        return col.deleteOne(reference)
    })
    .then(() => callback(false))
    .catch(err => callback(err.message))
}



module.exports = lib