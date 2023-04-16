import React, { useEffect, useRef, useState } from "react";
import date from "../lib/date";

function Note({ note, deleteNote, updateNote }) {
  const [edit, setEdit] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [edit]);

  const toggleEdit = () => {
    setEdit(!edit);
  };

  return (
    <div className="w-full mb-4 border card bg-base-100">
      <header className="px-8 py-4 border-b">
        <h4 className="font-medium">{note.user.name}</h4>
        <p className="text-xs">{date.fromNow(note.createdAt)}</p>
      </header>
      <div className="card-body">
        {/* TODO: FIx the autofocus on click */}
        <div>
          <textarea
            ref={inputRef}
            className="w-full min-h-0 py-3 border-none outline-none resize-none h-fit"
            defaultValue={note.content}
            style={{ display: edit ? "block" : "none" }}
            minLength={1000}
          ></textarea>
          <p
            className="py-3"
            onClick={toggleEdit}
            style={{ display: edit ? "none" : "block" }}
          >
            {note.content}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => deleteNote(note.id)}
            className="btn btn-sm btn-error"
          >
            Delete
          </button>

          {edit && (
            <>
              <button
                onClick={() => updateNote(note.id, inputRef.current.value)}
                className="btn btn-sm"
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
    </div>
  );
}

export default Note;
