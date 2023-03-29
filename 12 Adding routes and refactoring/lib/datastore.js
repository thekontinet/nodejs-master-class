const fs = require('fs').promises

const lib = {}

lib.basePath = __dirname + '/../.data/'

lib.create = function(collection, reference, content, callback){
    const dataToWrite = JSON.stringify(content)

    fs.writeFile(lib.basePath + collection + '/' + reference + '.json', dataToWrite, {flag: 'wx'})
        .then(() => callback(false))
        .catch(() => callback('Fail to write file  or data already exist'))
}

lib.find = function(collection, reference, callback){
    fs.readFile(lib.basePath + collection + '/' + reference + '.json', 'utf-8')
    .then(function(content){
        callback(false, JSON.parse(content))
    })
    .catch(function(err){
        callback(err)
    })
}

lib.update = function(collection, reference, content, callback){
    const dataToWrite = JSON.stringify(content)
    fs.writeFile(lib.basePath + collection + '/' + reference + '.json', dataToWrite)
        .then(() => callback(false))
        .catch(() =>  callback('Fail to write file'))
}

lib.delete = function(collection, reference, callback){
    fs.unlink(lib.basePath + collection + '/' + reference + '.json')
        .then(function(){
            callback(false)
        })
        .catch(function(err){
            callback(err)
        })
}



module.exports = lib