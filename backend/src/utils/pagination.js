const getPagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Wraps a page of docs + total count into a consistent paginated payload.
 * Shape matches the frontend's `Paginated<T>` type exactly:
 * { items, total, page, limit }.
 *  */
//  *
//  * @param {Array} docs
//  * @param {number} total
//  * @param {{ page: number, limit: number }} param2
//
const buildPaginatedResult = (docs, total, { page, limit }) => ({
  items: docs,
  total,
  page,
  limit,
});

module.exports = { getPagination, buildPaginatedResult };
