import React, { useContext, useState } from 'react';
import modeContext from '../Context/Dark_lightMode/modeContext';
import noteContext from '../Context/Notes/noteContext';

export default function AddNote(props) {
  const context = useContext(noteContext);
  const { addNotes } = context;

  const contextMode = useContext(modeContext);
  const{mode} = contextMode;

  const [note, setNote] = useState({ title: "", description: "", tag: "" });
  //This function will handle the final submit operation.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("note title: "+note.title);
    await addNotes(note.title, note.description, note.tag);

    props.showAlert("Notes added successfully.","Success","success");
    setNote({ title: "", description: "", tag: "" })
  }

  //This function will handle the changes occurs in the input form.
  const handleChange = (e) => {
    setNote((prevNote) => ({ ...prevNote, [e.target.name]: e.target.value }));
  }
  return (
    <>
      <h2 style={{color:mode === 'dark'?'white':'black'}}>Add Notes</h2>
      <div className="container my-3">
        <form>

          <div className="mb-3">
            <label htmlFor="title" className="form-label" style={{color:mode === 'dark'?'white':'black'}}>Title</label>
            <input type="text" className="form-control" id="title" name="title" onChange={handleChange} value={note.title} style={{color:mode === 'dark'?'white':'black', backgroundColor:mode==='dark'?'#293340':'white'}}/>
          </div>

          {/* <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" name='description' onChange={handleChange} />
          </div> */}

          <div className="form-group">
            <label htmlFor="description" style={{color:mode === 'dark'?'white':'black'}}>Description</label>
            <textarea className="form-control" id="description" name = "description" rows="3" onChange={handleChange} value={note.description} style={{color:mode === 'dark'?'white':'black', backgroundColor:mode==='dark'?'#293340':'white'}}></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="tag" className="form-label" style={{color:mode === 'dark'?'white':'black'}}>Tag</label>
            <input type="text" className="form-control" id="tag" name='tag' onChange={handleChange} value={note.tag} style={{color:mode === 'dark'?'white':'black', backgroundColor:mode==='dark'?'#293340':'white'}}/>
          </div>

          <button disabled = {note.title.length < 5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleSubmit}>Add Note</button>
          <div style={{height:"10px" , color:mode ==='dark'?'white':'black'}}>{(note.title.length < 5 || note.description.length<5)&&"[Title/Description should have at least 5 charactrers!]"} </div>
        </form>
      </div>
    </>
  )
}
