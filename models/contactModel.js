const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
    },
  name: { 
    type: String, 
    required: [true,'Please add name']
    },
  email: { 
    type: String, 
    required: [true,'Please add email']
    },
  phone: { 
    type: String, 
    required: [true,'Please add name']
     }, 
},
{
    timestamps:true
}
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;