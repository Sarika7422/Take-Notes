import React, { useContext } from 'react';
import modeContext from '../Context/Dark_lightMode/modeContext';
import noteContext from '../Context/Notes/noteContext';

export default function NoteItem(props) {
    const { note,updateNote,showAlert } = props;
    const context = useContext(noteContext);
    const context1 = useContext(modeContext);

    const {mode} = context1;
    const {deleteNotes} = context;

    return (
        <div className="col-md-3">
            <div className="card  my-3 ">
                <div className="card-body" style={{backgroundColor:mode==='dark'?'#293340':'white'}}>
                    <div className="d-flex align-items-center">
                        <h5 className="card-title" style={{color:mode === 'dark'?'white':'black'}}>{note.title} </h5>
                        <i className="fa-solid fa-trash-can mx-5" style={{color:mode === 'dark' && '#ebedef'}} onClick={()=>{deleteNotes(note._id,showAlert)}}></i>
                        <i className="fa-solid fa-pen-to-square mx-3" style={{color:mode === 'dark' && '#ebedef'}} onClick={()=>{updateNote(note)}}></i>
                    </div>
                    <p className="card-text" style={{color:mode === 'dark'?'white':'black'}}>{note.description}</p>
                    <p className="card-text" style={{color:mode==='dark'?'white':'black'}}><strong>Tag:</strong> {note.tag}</p>
                </div>
            </div>
        </div>
    )
}
