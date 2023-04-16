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

    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],

    likes_count: {
        type: Number,
        default: 0
    },

    comments: [{
        type:String,
        required: true
    }],

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