// Wraps an async Express route handler so errors are forwarded to
// the global error-handler middleware — no try/catch needed in controllers.
//  @param {Function} fn  async (req, res, next) => {}
//
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
