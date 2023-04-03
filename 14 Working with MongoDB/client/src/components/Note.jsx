import React, { useRef, useState } from "react";

function Note({ note, deleteNote, updateNote }) {
  const [edit, setEdit] = useState(false);
  const inputRef = useRef(null);

  const toggleEdit = () => {
    if (edit === false) {
      setEdit(true);
      inputRef.current.focus();
      console.dir(inputRef.current);
    } else {
      setEdit(false);
    }
  };

  return (
    <div className="card w-full mb-4 bg-base-100 border">
      <div className="card-body">
        {/* TODO: FIx the autofocus on click */}
        <input
          ref={inputRef}
          className="border-none outline-none py-5"
          defaultValue={note.content}
          style={{ display: edit ? "block" : "none" }}
        />
        <p
          className="py-5"
          onClick={toggleEdit}
          style={{ display: edit ? "none" : "block" }}
        >
          {note.content}
        </p>
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
                className="absolute top-2 right-4 p-2 border rounded-full w-10 h-10"
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
