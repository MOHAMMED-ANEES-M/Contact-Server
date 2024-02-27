const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

// get All Contacts
// GET /api/contacts/
const getContacts = asyncHandler(async (req,res) => {
    const contacts = await Contact.find({ userId: req.user.id })
    res.status(200).json({contacts})
});

// create Contact
// POST /api/contacts/
const createContact = asyncHandler(async (req,res) => {
    console.log('Create Contact req.body:',req.body);
    const {name, phone, email } = req.body
    if ( !name || !phone || !email ) {
        res.status(400);
        throw new Error("All fields are required")
    }
    const newContact = new Contact({ name, email, phone, userId: req.user.id })
    try {
        const response = await newContact.save();
        console.log('Contact created', newContact);
        res.status(201).json({ response });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500)
        throw new Error( "Internal Server Error" );
    }
});

// get a Contact
// GET /api/contacts/:id
const getContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id)
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
});

// update a Contact
// PUT /api/contacts/:id
const updateContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id)
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found")
    }
    try{
        if (contact.userId.toString() !== req.user.id) {
            res.status(403);
            throw new Error("Permission restricted")
        }
        const updatedContact = await Contact.findByIdAndUpdate( req.params.id, req.body, {new: true} )
        res.status(200).json(updatedContact)
    }catch(err){
        res.status(500).json(err)
    }
});

// delete a Contact
// DELETE /api/contacts/:id
const deleteContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id)
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found")
    }
    if (contact.userId.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Permission restricted")
    }
    // await Contact.remove()
    const deletedContact = await Contact.findByIdAndDelete(req.params.id)
    res.status(200).json(deletedContact)
});

module.exports = {getContact,getContacts,createContact,updateContact,deleteContact}