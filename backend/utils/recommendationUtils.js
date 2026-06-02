/**
 * Recommendation logic for product detail page.
 * - Similar: same category, ranked by subcategory / type / brand / price proximity
 * - Style with: complementary categories in outfit-completion order
 */

const OUTFIT_COMPLEMENTS = {
  Clothes: ['Shoes', 'Bags', 'Accessories', 'Watches'],
  Shoes: ['Clothes', 'Bags', 'Accessories', 'Watches'],
  Bags: ['Clothes', 'Shoes', 'Accessories', 'Watches'],
  Accessories: ['Clothes', 'Shoes', 'Bags', 'Watches'],
  Watches: ['Clothes', 'Shoes', 'Bags', 'Accessories'],
  'Makeup Marvels': ['Luxe Bestsellers', 'Bodycare', 'Accessories'],
  Bodycare: ['Makeup Marvels', 'Must-Have Hair Masks', 'Accessories'],
  'Must-Have Hair Masks': ['Bodycare', 'Makeup Marvels'],
  'Luxe Bestsellers': ['Makeup Marvels', 'Accessories', 'Bags'],
  'Middle Eastern Oud': ['Accessories', 'Luxe Bestsellers', 'Watches'],
  'Mom & Baby Essentials': ['Clothes', 'Shoes', 'Accessories'],
};

const DEFAULT_OUTFIT_CATEGORIES = ['Clothes', 'Shoes', 'Bags', 'Accessories', 'Watches'];

const CLOTHES_TYPE_PAIRS = {
  top: 'bottom',
  bottom: 'top',
  dress: 'shoes',
  outerwear: 'bottom',
  activewear: 'shoes',
};

const buildSubcategoryFilter = (subcategory) => {
  if (!subcategory || subcategory === 'Unisex') return {};
  return { subcategory: { $in: [subcategory, 'Unisex'] } };
};

const getOutfitCategories = (category) => {
  const complements = OUTFIT_COMPLEMENTS[category];
  if (complements?.length) return complements;
  return DEFAULT_OUTFIT_CATEGORIES.filter((c) => c !== category);
};

/**
 * Outfit slots: fetch in this order so carousel reads like a complete look
 * (e.g. leggings → sneakers → sports bra → bag → watch)
 */
const getOutfitSlots = (product) => {
  const { category, type } = product;

  if (category === 'Clothes') {
    const pairedType = CLOTHES_TYPE_PAIRS[type];
    if (type === 'bottom' || type === 'activewear') {
      return [
        { category: 'Shoes', limit: 2 },
        { category: 'Clothes', type: 'top', limit: 2 },
        { category: 'Bags', limit: 1 },
        { category: 'Accessories', limit: 2 },
        { category: 'Watches', limit: 1 },
      ];
    }
    if (type === 'top' || type === 'outerwear') {
      return [
        { category: 'Clothes', type: pairedType || 'bottom', limit: 2 },
        { category: 'Shoes', limit: 2 },
        { category: 'Bags', limit: 1 },
        { category: 'Accessories', limit: 2 },
        { category: 'Watches', limit: 1 },
      ];
    }
    if (type === 'dress') {
      return [
        { category: 'Shoes', limit: 2 },
        { category: 'Bags', limit: 2 },
        { category: 'Accessories', limit: 2 },
        { category: 'Watches', limit: 2 },
      ];
    }
  }

  if (category === 'Shoes') {
    return [
      { category: 'Clothes', type: 'bottom', limit: 2 },
      { category: 'Clothes', type: 'top', limit: 1 },
      { category: 'Bags', limit: 2 },
      { category: 'Accessories', limit: 2 },
      { category: 'Watches', limit: 1 },
    ];
  }

  if (category === 'Bags') {
    return [
      { category: 'Clothes', type: 'top', limit: 2 },
      { category: 'Shoes', limit: 2 },
      { category: 'Accessories', limit: 2 },
      { category: 'Watches', limit: 2 },
    ];
  }

  if (['Makeup Marvels', 'Bodycare', 'Must-Have Hair Masks', 'Luxe Bestsellers', 'Middle Eastern Oud'].includes(category)) {
    const slots = getOutfitCategories(category).map((cat, i) => ({
      category: cat,
      limit: i === 0 ? 3 : 2,
    }));
    return slots;
  }

  if (category === 'Watches' || category === 'Accessories') {
    return [
      { category: 'Clothes', type: 'top', limit: 2 },
      { category: 'Shoes', limit: 2 },
      { category: 'Bags', limit: 2 },
      { category: 'Clothes', type: 'bottom', limit: 2 },
    ].filter((slot, i, arr) => {
      const key = `${slot.category}-${slot.type || ''}`;
      return arr.findIndex((s) => `${s.category}-${s.type || ''}` === key) === i;
    });
  }

  const cats = getOutfitCategories(category);
  return cats.map((cat, i) => ({
    category: cat,
    limit: i < 2 ? 2 : 1,
  }));
};

const scoreSimilarProduct = (candidate, product) => {
  let score = 0;
  if (candidate.subcategory === product.subcategory) score += 4;
  else if (['Unisex', product.subcategory, candidate.subcategory].filter(Boolean).length) {
    if (candidate.subcategory === 'Unisex' || product.subcategory === 'Unisex') score += 2;
  }
  if (product.type && candidate.type === product.type) score += 3;
  if (product.brand && candidate.brand === product.brand) score += 1;
  const priceDiff = Math.abs((candidate.price || 0) - (product.price || 0));
  const priceRange = product.price || 1000;
  if (priceDiff <= priceRange * 0.35) score += 2;
  else if (priceDiff <= priceRange * 0.7) score += 1;
  score += (candidate.rating || 0) * 0.2;
  return score;
};

const rankSimilarProducts = (candidates, product, limit = 8) => {
  const seen = new Set([product._id.toString()]);
  return candidates
    .filter((p) => {
      const id = p._id.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((p) => ({ doc: p, score: scoreSimilarProduct(p, product) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc }) => doc);
};

const fetchOutfitBySlots = async (Product, product, slots, maxTotal = 8) => {
  const picked = [];
  const usedIds = new Set([product._id.toString()]);

  for (const slot of slots) {
    if (picked.length >= maxTotal) break;

    const excludeIds = [product._id, ...[...usedIds]];
    const query = {
      _id: { $nin: excludeIds },
      category: slot.category,
      status: 'Approved',
    };

    if (slot.type) query.type = slot.type;
    Object.assign(query, buildSubcategoryFilter(product.subcategory));

    const remaining = maxTotal - picked.length;
    const limit = Math.min(slot.limit || 2, remaining);

    let items = await Product.find(query)
      .sort({ rating: -1, numReviews: -1 })
      .limit(limit * 2);

    if (items.length < limit && slot.type) {
      const fallbackQuery = { ...query };
      delete fallbackQuery.type;
      const extra = await Product.find(fallbackQuery)
        .sort({ rating: -1 })
        .limit(limit * 2);
      items = [...items, ...extra];
    }

    for (const item of items) {
      if (picked.length >= maxTotal) break;
      const id = item._id.toString();
      if (!usedIds.has(id)) {
        usedIds.add(id);
        picked.push(item);
      }
      if (picked.filter((p) => p.category === slot.category).length >= limit) break;
    }
  }

  return picked;
};

module.exports = {
  getOutfitCategories,
  getOutfitSlots,
  buildSubcategoryFilter,
  rankSimilarProducts,
  fetchOutfitBySlots,
};
