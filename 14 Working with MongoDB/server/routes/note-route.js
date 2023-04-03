const express = require("express");
const datastore = require("../lib/datastore");
const helpers = require("../lib/helpers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.use("/notes", auth);

router.post("/notes", function (req, res) {
  /* Destructuring the request body. */
  let { content } = req.body;

  // Validation
  content =
    typeof content === "string" && content.trim().length > 0
      ? content.trim()
      : false;

  let phone = req.userId;

  /* This is a validation check. If the content and phone number are not valid, then the user will
    get an error message. */
  if ((content && phone) === false) {
    return res.send(
      { error: "Please enter valid content and phone number" },
      400
    );
  }

  /* Creating an object with the content and phone number. */
  const dataToSave = { id: helpers.randomString(12), content: content, phone: phone }

  datastore.create("notes", dataToSave, function (err) {
    if (err) return res.send({ error: "Error while creating note : " + err }, 400);
    res.send({ message: "Note created successfully" }, 201);
  });
});

router.get("/notes", function (req, res) {
  /* Destructuring the request query. */
  let phone = req.userId;

  /* This is a validation check. If the phone number is not valid, then the user will get an error
    message. */
  phone =
    typeof phone === "string" &&
    phone.trim().length > 10 &&
    phone.trim().length < 14
      ? phone.trim()
      : false;

  if (phone === false) {
    return res.send({ error: "Please enter valid phone number" }, 400);
  }

  /* This is a function that is used to find a note. */
  datastore.findAll("notes", {phone}, function (err, data) {
    if (err || !data) return res.send({ error: "Note not found" }, 404);

    res.send(data, 200);
  });
});

router.put("/notes", function (req, res) {
    let {id} = req.query
  let { content } = req.body;

  // Validation
  content =
    typeof content === "string" && content.trim().length > 0
      ? content.trim()
      : false;

  let phone = req.userId;

  if ((content && phone) === false) {
    return res.send(
      { error: "Please enter valid content and phone number" },
      400
    );
  }

  /* This is a function that is used to find a note. */
  datastore.find("notes", {id}, function (err, note) {
    if (err || !note) return res.send({ err: "Note not found: " + err }, 400);

    /* This is a function that is used to update a note. */
    datastore.update("notes", {id}, {content}, function (err) {
      if (err) return res.send({ error: "Failed to update note" });
      res.send({ message: "successful" }, 200);
    });
  });
});

router.delete("/notes", function (req, res) {
  let {id} = req.query
  let phone = req.userId;

  if (phone === false) {
    return res.send({ error: "Please enter valid phone number" }, 400);
  }

  /* This is a function that is used to find a note. */
  datastore.find("notes", {id}, function (err, note) {
    if (err || !note) return res.send({ err: "Note not found" }, 400);
    
    /* This is a function that is used to delete a note. */
    datastore.delete("notes", {id}, function (err) {
      if (err) return res.send({ error: "Failed to delete note" });
      res.send({ message: "successful" }, 200);
    });
  });
});

module.exports = router;
