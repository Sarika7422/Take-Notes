const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//Router = 1, used for get all notes for a particular user, end point "/api/notes/fetchallnotes" loggin required.
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
})

//Router = 2, used for store notes into the data base using post request, end point "/api/notes/addnotes" loggin required.
router.post("/addnotes", fetchuser, [body('title', 'Enter a valid title').isLength({ min: 3 }), body('description', "Enter a valid description").isLength({ min: 5 })], async (req, res) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ error: "Enter correct fields for notes" });
        }
    } catch (error) {
        res.status(500).json({ error: "Some internal error occured." });
    }

    try {
        const { title, description, tag } = req.body;
        const note = new Notes({
            user: req.user.id,
            title: title,
            description: description,
            tag: tag
        });

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        res.status(500).json({ error: "Some internal error occured." });
    }
})

//Route = 3, update notes,end point "/api/notes/" loggein required.
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
    //verifying the user authentication.
    let note = await Notes.findById(req.params.id);
    if (!note) {
        return res.status(404).send("User not found");
    }

    //Here checking the correct user accdssing his/her notes or not.
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
    }

    //Preparing new note according to the user modified value.
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
        newNote.title = title;
    }
    if (description) {
        newNote.description = description;
    }
    if (tag) {
        newNote.tag = tag;
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json(note);
})


//Route = 4, delete notes,end point "/api/notes/" loggin required.
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
    //verifying the user authentication.
    let note = await Notes.findById(req.params.id);
    try {
        if (!note) {
            return res.status(404).send("User not found");
        }

        //Here checking the correct user accdssing his/her notes or not.
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ success: "Note has been deleted", note: note });
    }
    catch (error) {
        res.status(500).json({ error: "Some internal error has occured." });
    }
})

module.exports = router;