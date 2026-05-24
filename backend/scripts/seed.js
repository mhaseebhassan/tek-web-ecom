require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { spawn } = require('child_process');
const path = require('path');

const runScript = (scriptName) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(__dirname, scriptName)], {
      stdio: 'inherit',
      env: process.env,
    });

    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptName} exited with code ${code}`));
    });
  });

const seed = async () => {
  try {
    await runScript('seedAdmin.js');
    await runScript('seedProducts.js');
    console.log('All seed scripts completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
