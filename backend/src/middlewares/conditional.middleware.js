const conditionalMiddleware = (condition, middleware) => (req, res, next) => {
  if (typeof condition === 'function' ? condition(req) : condition) {
    return middleware(req, res, next);
  }
  return next();
};

module.exports = conditionalMiddleware;
