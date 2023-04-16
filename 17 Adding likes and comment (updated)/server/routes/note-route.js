const express = require("express");
const datastore = require("../lib/datastore");
const helpers = require("../lib/helpers");
const auth = require("../middlewares/auth");
const NoteModel = require("../models/note-model");
const router = express.Router();

router.use("/notes", auth);

router.post("/notes", async function (req, res) {
  /* Destructuring the request body. */
  let { content } = req.body;

  // Validation
  content =
    typeof content === "string" && content.trim().length > 0
      ? content.trim()
      : false;

  let id = req.userId;

  /* This is a validation check. If the content and phone number are not valid, then the user will
    get an error message. */
  if (!content) {
    return res.status(400).send({ error: "Please enter valid content" });
  }


  const note = await NoteModel.create({ content: content, user: id })
  res.status(201).send({ status: true, data: note });
});

router.get("/notes", async function (req, res) {
  const notes = await NoteModel.find().populate({path:'user', select: '-password'})
  res.status(200).send({status: true, data: notes});
});

router.get("/notes/:id", async function (req, res) {
  let {id} = req.params;
  const note = await NoteModel.findOne({_id:id}).populate({path:'user', select: '-password'})
  res.status(200).send({status: true, data: note});
});

router.put("/notes/:id", async function (req, res) {
  let noteId = req.params.id
  let { content } = req.body;

  // Validation
  content =
    typeof content === "string" && content.trim().length > 0
      ? content.trim()
      : false;

  if (!content) {
    return res.status(400).send({ status: false, message:"Please enter valid content" });
  }

  const note = await NoteModel.findOne({_id: noteId})

  if(!note)  return res.status(404).send({status: false, message: "Note not found"})

  note.content = content
  await note.save()

  return res.status(200).send({status: true, data: note})
});

router.delete("/notes/:id", async function (req, res) {
  let {id} = req.params

  const note = await NoteModel.findOne({_id: id, user: req.userId})

  if(!note)  return res.status(404).send({status: false, message: "Note cannot be deleted"})

  note.deleteOne()

  res.status(200).send({ status: true, data: {} }, 200);
});

router.post('/notes/:id/likes', async function(req, res){
    let {id} = req.params
    let {userId} = req

    const note = await NoteModel.findOne({_id: id})

    if(!note) return res.status(404).send({error: 'Note not found', status: false});

    const likeExist = note.likes?.indexOf(userId) > -1

    if(likeExist){
      note.likes.pull(userId)
      note.likes_count--
    }else{
      note.likes?.push(userId)
      note.likes_count++
    }

    await note.save()

    return res.status(200).send({status: true, message: likeExist ? 'Post unliked' : 'Post liked'})
})

router.post('/notes/:id/comments', async function(req, res){
  let {id} = req.params
  let {userId} = req
  let {content} = req.body

  const note = await NoteModel.findOne({_id: id})

  if(!note) return res.status(404).send({error: 'Note not found', status: false});

  note?.comments.push(content)

  await note.save()

  return res.status(200).send({status: true, message: 'comment saved'})
})

module.exports = router;
