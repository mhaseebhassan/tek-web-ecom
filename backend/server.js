require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const { initSocket } = require('./src/sockets/socket');
const { connectKafka } = require('./src/config/kafka');
const { startKafkaWorker } = require('./src/workers/kafka.worker');

connectDB();
connectRedis();
connectKafka().then(() => {
  startKafkaWorker();
});

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${PORT} is already in use. Another backend instance may still be running.\n` +
        `Windows fix: netstat -ano | findstr :${PORT}  then  taskkill /PID <pid> /F\n` +
        `Or set a different PORT in backend/.env\n`
    );
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
