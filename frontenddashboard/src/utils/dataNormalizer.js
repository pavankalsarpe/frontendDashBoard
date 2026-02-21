/**
 * Normalize API row to a consistent shape (handles snake_case / camelCase).
 * Expected fields: product name, category, rating, review count, discount.
 */
export function normalizeRow(row) {
  if (!row || typeof row !== 'object') return null;
  const get = (obj, ...keys) => {
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
    }
    return undefined;
  };
  const productName = get(row, 'product_name', 'productName', 'Product Name', 'Product');
  const category = get(row, 'category', 'Category');
  const rating = get(row, 'rating', 'Rating', 'average_rating');
  const reviewCount = get(row, 'review_count', 'reviewCount', 'reviews', 'Reviews', 'num_reviews');
  const discount = get(row, 'discount', 'Discount', 'discount_percentage', 'Discount Percentage');
  const numRating = typeof rating === 'number' ? rating : parseFloat(rating);
  const numReview = typeof reviewCount === 'number' ? reviewCount : parseInt(reviewCount, 10);
  const numDiscount = typeof discount === 'number' ? discount : parseFloat(discount);
  return {
    id: row.id ?? `${productName}-${category}-${Math.random().toString(36).slice(2)}`,
    productName: productName ?? '—',
    category: category ?? '—',
    rating: Number.isNaN(numRating) ? null : numRating,
    reviewCount: Number.isNaN(numReview) ? null : numReview,
    discount: Number.isNaN(numDiscount) ? null : numDiscount,
    raw: row,
  };
}

export function normalizeSalesData(data) {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeRow).filter(Boolean);
}
