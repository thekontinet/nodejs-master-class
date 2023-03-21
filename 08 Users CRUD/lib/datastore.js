const fs = require('fs')

let lib = {}

lib.basePath = __dirname + '/../.data/'
console.log(lib.basePath);

// Create new JSON record in the collection
lib.create = function(collection, reference, data, callback){

    // Create a new file or fail if it already exists
    // The wx flag means it should create a new file and open for writing or return error if file exists
    fs.open(lib.basePath + collection + '/' + reference + '.json', 'wx', function(err, fileRef){
        if(err) return callback("This record already exists or cannot be created")

        // Write the data to the file
        fs.write(fileRef, JSON.stringify(data), function(err){
            if(err) return callback("Failed to save new data")

            // Close the file
            fs.close(fileRef, function(err){
                if(err) return callback("Something went wrong and file could not close")
                callback(false)
            })
        })
    })
}

// Read content of a record in a collection
lib.read = function(collection, reference, callback){
    // Open an existing file or fail if file does not exist
    // The r flag means open the file for reading only
    fs.open(lib.basePath + collection + '/' + reference + '.json', 'r', function(err, fileRef){
        if(err) return callback("Data does not exist")
        
        // Read the content of the file
        fs.readFile(fileRef, 'utf-8', function(err, content){
            if(err) return callback("Cannot read data")

            // Close the file
            fs.close(fileRef, function(err){
                if(err) return callback('Something went wrong while trying to close file')
                const contentToJson = JSON.parse(content)
                callback(false, contentToJson)
            })
        })
    })
}

// Update content of a record in a collection
lib.update = function(collection, reference, content, callback){

    // Open the file or fail if not exist
    // The r+ flag means open file for reading and writing
    fs.open(lib.basePath + collection + '/' + reference + '.json', 'r+', function(err, fileRef){
        if(err) return callback("Data does not exist")

        // Clear the content of the file
        fs.ftruncate(fileRef, function(err){
            if(err) return callback("data cannot be cleared")

            // Write the new data to the file
            fs.write(fileRef, JSON.stringify(content), function(err){
                if(err) return callback("cannot update data")

                // Close the file
                fs.close(fileRef, function(err){
                    if(err) return callback("Something went wrong while closing file")

                    callback(false)
                })
            })
        })
    })
}

// Delete record from collection
lib.delete = function(collection, reference, callback){
    // Delete the collection file from the collection folder
    fs.unlink(lib.basePath + collection + '/' + reference + '.json', function(err){
        if(err) return callback('Record not found or cannot be deleted')
        callback(false)
    })
}

module.exports = lib