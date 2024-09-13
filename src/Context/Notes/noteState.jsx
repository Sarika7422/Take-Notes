import React, { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props)=>{
    const host = "http://localhost:5000";
    // const host = import.meta.env.REACT_APP_HOST;

    const noteInitial = [];
    const [notes,setNotes] = useState(noteInitial);

    //This function is used for fetch all notes from database.
      const fetchAllNotes = async()=>{
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
          }});
        const json = await response.json();
        // console.log("json response is : ");
        setNotes(json);
      }
      
      //Add note
      const addNotes = async(title, description, tag)=>{
        // console.log("Called addNotes function in noteState");
        //TODO : API call
        //API call
        const response = await fetch(`${host}/api/notes/addnotes`, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
          },
          body: JSON.stringify({title,description,tag})// body data type must match "Content-Type" header
        });
        const json = await response.json();
        console.log("add note json : ",json );

        const note = {
          "_id": json._id,
          "user": json.user,
          "title": title,
          "description": description,
          "tag": tag,
          "date": json.date,
          "__v": 0
        };

        setNotes(notes.concat(note));
      }
      //Delete note
      const deleteNotes = async(id,showAlert)=>{
        // console.log("Id of the deleted note is : ",id);
        //API call
        const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
          method: "DELETE", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
          }
        });
        const json =await response.json();
        console.log("delete note json : ",json);

        //Logic for delete notes from client.
        setNotes(notes.filter((note)=>{
          return note._id !== id;
        }));
        showAlert("Notes deleted successfully.","Delete","success");
      }
      //Edit note
      const editNotes = async(id,title,description,tag)=>{
        console.log("Called edit note in noteState");
          //API call
          const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag}), // body data type must match "Content-Type" header
          });
          const json =await response.json();
          console.log("edit note json : ",json);

          //Logic for update notes
          let newNotes = JSON.parse(JSON.stringify(notes)); // This creates a deep copy of notes.
          for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
              element.title = title;
              element.description = description;
              element.tag = tag;
              break;
            }
          }
          setNotes(newNotes);
      }
    return(
        <noteContext.Provider value={{notes,addNotes,deleteNotes,editNotes,fetchAllNotes}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;