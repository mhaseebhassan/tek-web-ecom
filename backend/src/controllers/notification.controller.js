const Notification = require('../models/notification.model');
const asyncHandler = require('../middlewares/async.middleware');
const ApiError = require('../utils/ApiError');

const serializeNotification = (notification) => {
  const plain = notification.toObject ? notification.toObject() : notification;
  return {
    id: plain._id.toString(),
    type: plain.type,
    title: plain.title,
    message: plain.message,
    data: plain.data,
    isRead: plain.isRead,
    createdAt: plain.createdAt,
  };
};

exports.getNotifications = asyncHandler(async (req, res) => {
  const filter = {
    $or: [{ recipient: req.user.id }, { roleTarget: req.user.role }, { roleTarget: 'all' }],
  };

  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);

  res.status(200).json({
    success: true,
    notifications: notifications.map(serializeNotification),
  });
});

exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    $or: [{ recipient: req.user.id }, { roleTarget: req.user.role }, { roleTarget: 'all' }],
  });
  if (!notification) return next(new ApiError(404, 'Notification not found'));

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    notification: serializeNotification(notification),
  });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      isRead: false,
      $or: [{ recipient: req.user.id }, { roleTarget: req.user.role }, { roleTarget: 'all' }],
    },
    { isRead: true }
  );

  res.status(200).json({ success: true, message: 'All notifications marked as read' });
});
