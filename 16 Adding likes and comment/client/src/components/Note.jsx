import React, { useEffect, useRef, useState } from "react";
import axios from "../lib/axios";
import date from "../lib/date";
import useAuth from "../hooks/auth";
import api from "../lib/api";
import { Link } from "react-router-dom";

function Note({ data }) {
  const [note, setNote] = useState(data);
  const [edit, setEdit] = useState(false);
  const { user } = useAuth();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [edit]);

  const likeNote = (id) => {
    api
      .likeNote(id)
      .then(() => {
        return api.getNote(note?.id);
      })
      .then((res) => setNote(res.data.data))
      .catch((err) => console.log(err.message));
  };

  const deleteNote = (id) =>
    api.deleteNote(id).then((res) => {
      toast.success("Note deleted");
      fetchNotes();
    });

  const updateNote = (id, content) =>
    api.updateNote({ content }).then((res) => {
      toast.success("Note updated");
      fetchNotes();
    });

  const toggleEdit = () => {
    setEdit(!edit);
  };

  const userHasLiked = note?.likes?.indexOf(user?.id) > -1;

  const getLikeText = () => {
    const likes = note?.likes || [];
    const userLiked = likes.some((like) => like?.user?.id === user?.id);

    if (likes.length === 0) {
      return "Be the first person to like this post";
    } else if (likes.length === 1 && userLiked) {
      return "You liked this post";
    } else if (likes.length === 1 && !userLiked) {
      const likedBy = likes[0]?.user?.name || "someone";
      return `${likedBy} liked this post`;
    } else if (likes.length > 1 && userLiked) {
      const otherLikes = likes.length - 1;
      return `You and ${otherLikes} others liked this post`;
    } else {
      return `${likes.length} persons liked this post`;
    }
  };

  return (
    <>
      <div className="w-full mb-4 overflow-hidden border card bg-base-100">
        <header className="px-8 py-4 border-b">
          <h4 className="font-medium">
            <Link to={`/notes/${note?.id}`}>{note?.user.name}</Link>
          </h4>
          <p className="text-xs">{date.fromNow(note?.createdAt)}</p>
        </header>
        <div className="card-body">
          <div>
            <textarea
              ref={inputRef}
              className="w-full min-h-0 py-3 border-none outline-none resize-none h-fit"
              defaultValue={note?.content}
              style={{ display: edit ? "block" : "none" }}
              minLength={1000}
            ></textarea>
            <p
              className="py-3"
              onClick={toggleEdit}
              style={{ display: edit ? "none" : "block" }}
            >
              {note?.content}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-xs">{getLikeText()}</p>
            <p className="text-xs text-right">
              comments ({note?.comments?.length})
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => likeNote(note?.id)}
            className={`shadow-sm px-3 text-sm btn btn-sm flex-1 rounded-sm ${
              userHasLiked ? "btn-primary" : ""
            }`}
          >
            Like
          </button>
          {note?.user?._id == user?._id && (
            <button
              onClick={() => deleteNote(note?.id)}
              className="flex-1 rounded-sm btn btn-sm btn-error"
            >
              Delete
            </button>
          )}

          {edit && (
            <>
              <button
                onClick={() => updateNote(note?.id, inputRef.current.value)}
                className="flex-1 rounded-sm btn btn-sm"
              >
                Update
              </button>
              <button
                onClick={toggleEdit}
                className="absolute w-10 h-10 p-2 border rounded-full top-2 right-4"
              >
                X
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Note;
