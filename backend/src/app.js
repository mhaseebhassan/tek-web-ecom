const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { assertProductionEnv } = require('./config/env');
require('./config/passport');

const errorHandler = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');
const { globalLimiter } = require('./middlewares/rateLimit.middleware');

const app = express();
assertProductionEnv();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(helmet());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);
app.use(globalLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(compression());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(passport.initialize());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tekron API is healthy',
    timestamp: new Date().toISOString(),
  });
});

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
const reviewRoutes = require('./routes/review.routes');
const notificationRoutes = require('./routes/notification.routes');
const uploadRoutes = require('./routes/upload.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Tekron API is running...');
});

app.use((req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(errorHandler);

module.exports = app;
