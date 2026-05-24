const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../../uploads');

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

module.exports = { ensureUploadsDir, uploadsDir };
