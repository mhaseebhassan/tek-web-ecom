const requireEnv = (name, fallback) => {
  const value = process.env[name] || fallback;

  if (process.env.NODE_ENV === 'production' && (!process.env[name] || process.env[name] === fallback)) {
    throw new Error(`${name} must be set in production`);
  }

  return value;
};

const getJwtAccessSecret = () => requireEnv('JWT_ACCESS_SECRET', 'dev_access_secret_change_me');

const assertProductionEnv = () => {
  if (process.env.NODE_ENV !== 'production') return;

  requireEnv('MONGO_URI');
  requireEnv('JWT_ACCESS_SECRET', 'dev_access_secret_change_me');
  requireEnv('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me');
};

module.exports = {
  assertProductionEnv,
  getJwtAccessSecret,
  requireEnv,
};
