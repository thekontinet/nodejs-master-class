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
  let id = req.userId;
  const notes = await NoteModel.find().populate({path:'user', select: '-password'})
  res.status(200).send({status: true, data: notes});
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

  const note = await NoteModel.findOne({_id: id})

  if(!note)  return res.status(404).send({status: false, message: "Note not found"})

  note.deleteOne()

  res.status(200).send({ status: true, data: {} }, 200);
});

module.exports = router;
