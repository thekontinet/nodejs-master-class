import React, { useEffect, useState } from "react";
import Note from "../components/Note";
import useAuth from "../hooks/auth";
import axios from "../lib/axios";

const Home = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(function () {
    fetchNotes();
  }, []);

  let [content, setContent] = useState("");

  const fetchNotes = () =>
    axios.get("/notes").then((res) => setNotes(res.data.data.reverse()));

  const deleteNote = (id) =>
    axios.delete(`/notes/${id}`).then((res) => {
      alert("Note deleted");
      fetchNotes();
    });

  const updateNote = (id, content) =>
    axios.put(`/notes/${id}`, { content }).then((res) => {
      alert("Note updated");
      fetchNotes();
    });

  const handleSubmit = function (e) {
    e.preventDefault();
    content =
      typeof content === "string" && content.trim().length > 0
        ? content.trim()
        : false;

    if (content === false) {
      return setError("Please provide valid information");
    }

    axios
      .post("/notes", { content })
      .then((res) => {
        alert("Note created");
        setContent("");
        fetchNotes();
      })
      .catch((err) => alert(err.message));
  };
  return (
    <div className="flex justify-center h-screen py-4">
      {!user ? (
        <div className="shadow-xl card w-96 bg-base-100">
          <div className="card-body">
            <h2 className="card-title">NOTE APP</h2>
            <p>Share your ideas and taught with friends</p>
            <div className="justify-end card-actions">
              <>
                <a className="btn" href="/login">
                  Login
                </a>
                <a className="btn btn-primary" href="/register">
                  Register
                </a>
              </>
            </div>
          </div>
        </div>
      ) : null}

      {user && (
        <div className="w-full max-w-xl">
          <header className="flex items-center justify-between px-8 py-4 text-white bg-primary rounded-xl">
            <h1>Welcome {user.name}</h1>
            <button className="btn btn-sm" onClick={() => logout()}>
              Logout
            </button>
          </header>
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
              <Note
                key={note.id}
                note={note}
                deleteNote={deleteNote}
                updateNote={updateNote}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
