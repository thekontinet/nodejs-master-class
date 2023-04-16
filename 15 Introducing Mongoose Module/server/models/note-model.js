const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },

    user:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },

    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    }
})

NoteSchema.methods.toJSON = function(){
    const note = this.toObject()
    note.id = note._id
    return note
}

const NoteModel = mongoose.model('Note', NoteSchema)

module.exports = NoteModel