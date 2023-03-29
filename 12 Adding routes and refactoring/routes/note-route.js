const express = require('express')
const datastore = require('../lib/datastore')
const router = express.Router()


router.post('/notes', function(req, res){
    /* Destructuring the request body. */
    let {content, phone} = req.body

    // Validation
    content = typeof(content) === 'string' && content.trim().length > 0 ? content.trim() : false
    phone = typeof(phone) === 'string' && phone.trim().length > 10 && phone.trim().length < 14 ? phone.trim() : false

    /* This is a validation check. If the content and phone number are not valid, then the user will
    get an error message. */
    if((content && phone) === false){
        return res.send({error: "Please enter valid content and phone number"}, 400)
    }

    /* Creating an object with the content and phone number. */
    const dataToSave = {
        content: content,
        phone: phone
    }

    /* This is creating a new note. */
    datastore.create('notes', phone, dataToSave, function(err){
        if(err) return res.send({error: "Error while creating note : " + err}, 400)

        res.send({message: "Note created successfully"}, 201)
    })
})


router.get('/notes', function(req, res){
    /* Destructuring the request query. */
    let {phone} = req.query

    /* This is a validation check. If the phone number is not valid, then the user will get an error
    message. */
    phone = typeof(phone) === 'string' && phone.trim().length > 10 && phone.trim().length < 14 ? phone.trim() : false

    if(phone === false){
        return res.send({error: "Please enter valid phone number"}, 400)
    }

    /* This is a function that is used to find a note. */
    datastore.find('notes', phone, function(err, data){
        if(err) return res.send({error: "Note not found"}, 404)

        res.send(data, 200)
    })

})

router.put('/notes', function(req, res){
    let {content, phone} = req.body

    // Validation
    content = typeof(content) === 'string' && content.trim().length > 0 ? content.trim() : false
    phone = typeof(phone) === 'string' && phone.trim().length > 10 && phone.trim().length < 14 ? phone.trim() : false

    if((content && phone) === false){
        return res.send({error: "Please enter valid content and phone number"}, 400)
    }

    /* Creating an object with the content and phone number. */
    const dataToSave = {
        content: content,
        phone: phone
    }

   /* This is a function that is used to find a note. */
    datastore.find('notes', phone, function(err, data){
        if(err) res.send({err: "Note not found: " + err}, 400)
        /* This is a function that is used to update a note. */
        datastore.update('notes', phone, dataToSave, function(err){
            if(err) return res.send({error: "Failed to update note"})
            res.send({message: "successful"}, 200)
        })
    })
})


router.delete('/notes', function(req, res){
    let {phone} = req.query
    phone = typeof(phone) === 'string' && phone.trim().length > 10 && phone.trim().length < 14 ? phone.trim() : false

    if( phone === false){
        return res.send({error: "Please enter valid phone number"}, 400)
    }

   /* This is a function that is used to find a note. */
    datastore.find('notes', phone, function(err, data){
        if(err) return res.send({err: "Note not found"}, 400)
        /* This is a function that is used to delete a note. */
        datastore.delete('notes', phone, function(err){
            if(err) return res.send({error: "Failed to delete note"})
            res.send({message: "successful"}, 200)
        })
    })
})



module.exports = router