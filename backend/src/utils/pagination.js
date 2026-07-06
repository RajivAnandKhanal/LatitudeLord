// ── Pagination helper ───────────────────────────────────────────────────────────
// Pure helper — no Express, no Mongoose dependencies.

// /**
//  * Parses page & limit from query params into Mongoose-ready values.
//  * Defaults: page=1, limit=20. limit is capped at 100 to avoid huge scans.
//  *
//  * @param {object} query  e.g. req.query
//  * @returns {{ page: number, limit: number, skip: number }}
//  */
const getPagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Wraps a page of docs + total count into a consistent paginated payload.
 *
 * @param {Array} docs
 * @param {number} total
 * @param {{ page: number, limit: number }} param2
 */
const buildPaginatedResult = (docs, total, { page, limit }) => ({
  results: docs,
  pagination: {
    page,
    limit,
    totalItems: total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  },
});

module.exports = { getPagination, buildPaginatedResult };
