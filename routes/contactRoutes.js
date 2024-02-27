const express = require('express')
const router = express.Router()
const {getContact,getContacts,createContact,updateContact,deleteContact} = require('../controllers/contactController');
const verifyToken = require('../middleware/VerifyTokenHandler');


router.use(verifyToken)
router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);


// router.route("/").get(getContacts);
// router.route("/").post(createContact);
// router.route("/:id").get(getContact);
// router.route("/:id").put(updateContact);
// router.route("/:id").delete(deleteContact);

module.exports = router