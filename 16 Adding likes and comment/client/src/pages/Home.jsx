import React, { useEffect, useState } from "react";
import Note from "../components/Note";
import api from "../lib/api";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

const Home = () => {
  const [notes, setNotes] = useState([]);

  useEffect(function () {
    fetchNotes();
  }, []);

  let [content, setContent] = useState("");

  const fetchNotes = () =>
    api.getNotes().then((res) => setNotes(res.data.data.reverse()));

  const handleSubmit = function (e) {
    e.preventDefault();
    content =
      typeof content === "string" && content.trim().length > 0
        ? content.trim()
        : false;

    if (content === false) {
      return setError("Please provide valid information");
    }

    api
      .createNote({ content })
      .then((res) => {
        toast.success("Note created");
        setContent("");
        fetchNotes();
      })
      .catch((err) => alert(err.message));
  };
  return (
    <Layout>
      <form className="my-6" onSubmit={handleSubmit}>
        <textarea
          className="w-full resize-none textarea textarea-bordered"
          name="content"
          cols="30"
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell us your mind"
        ></textarea>
        <button className="btn btn-sm btn-primary">Create</button>
      </form>
      <ul>
        {notes.map((note) => (
          <Note key={note.id} data={note} />
        ))}
      </ul>
    </Layout>
  );
};

export default Home;
