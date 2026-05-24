const Notification = require('../models/notification.model');
const asyncHandler = require('../middlewares/async.middleware');

exports.submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  await Notification.create({
    roleTarget: 'admin',
    type: 'contact_message',
    title: `Contact message from ${name}`,
    message,
    data: { name, email },
  });

  res.status(202).json({
    success: true,
    message: 'Message received. Our team will respond shortly.',
  });
});
