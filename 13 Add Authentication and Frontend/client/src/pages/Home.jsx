import React, { useEffect, useState } from "react";
import useAuth from "../hooks/auth";
import axios from "../lib/axios";

const Home = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(function () {
    fetchNotes();
  }, []);

  let [content, setContent] = useState("");

  const fetchNotes = () =>
    axios.get("/notes").then((res) => setNotes(res.data));

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
        fetchNotes();
      })
      .catch((err) => alert(err.message));
  };
  return (
    <div>
      {!user ? (
        <>
          <a href="/login">Login</a> <a href="/register">Register</a>
        </>
      ) : null}

      {user && (
        <div>
          <h1>Welcome {user.name}</h1>
          <form onSubmit={handleSubmit}>
            <textarea
              name="content"
              cols="30"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button>Create</button>
          </form>
          <ul>
            {notes.map((note, index) => (
              <li key={index}>{note.content}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
