import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import { toast } from "react-toastify";
import date from "../lib/date";
import Note from "../components/Note";
import Layout from "../components/Layout";

function SingleNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");

  useEffect(function () {
    api
      .getNote(id)
      .then((res) => setNote(res.data.data))
      .catch((err) => toast.error(err.message))
      .finally(() => {
        setContent("");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .postComment(note?.id, { content })
      .then(() => {
        toast.success("Comment posted");
        api.getNote(note.id).then((res) => setNote(res.data.data));
      })
      .catch(() => toast.error("error posting comment"));
  };

  if (!note) return <h1>Loading</h1>;

  return (
    <Layout>
      <Note data={note} />
      <h1 className="my-4 text-xl font-medium">Comments</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          name=""
          id=""
          cols="30"
          rows="4"
          placeholder="Write comment"
          className="w-full textarea textarea-bordered"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        ></textarea>
        <button className="btn btn-sm btn-primary">Post</button>
      </form>

      {note?.comments?.map((comment, index) => (
        <p className="p-3 my-4 text-xs rounded-lg bg-slate-200" key={index}>
          {comment}
        </p>
      ))}
    </Layout>
  );
}

export default SingleNote;
