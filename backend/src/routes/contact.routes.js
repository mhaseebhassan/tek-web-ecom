const express = require('express');
const { submitContact } = require('../controllers/contact.controller');
const validate = require('../middlewares/validate.middleware');
const { contactSchema } = require('../validators/contact.validator');

const router = express.Router();

router.post('/', validate(contactSchema), submitContact);

module.exports = router;
