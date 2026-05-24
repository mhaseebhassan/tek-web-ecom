const express = require('express');
const { uploadImage } = require('../controllers/upload.controller');
const { protect, authorizeRoles } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.post('/', protect, authorizeRoles('admin'), upload.single('image'), uploadImage);

module.exports = router;
