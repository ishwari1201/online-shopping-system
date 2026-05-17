const products = [
  // --- CLOTHES ---
  {
    name: 'Classic White T-Shirt',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Essential white crewneck t-shirt made from 100% organic cotton. Lightweight, breathable, and perfect for everyday wear.',
    brand: 'EcoFashion',
    category: 'Clothes',
    subcategory: 'Unisex',
    price: 999,
    countInStock: 150,
    status: 'Approved',
    rating: 4.5,
    numReviews: 12
  },
  {
    name: 'Slim Fit Denim Jeans',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Premium stretch denim in a slim, modern fit. Features a classic 5-pocket styling and slight distressing.',
    brand: 'UrbanStyle',
    category: 'Clothes',
    subcategory: 'Men',
    price: 2499,
    countInStock: 80,
    status: 'Approved',
    rating: 4.8,
    numReviews: 25
  },
  {
    name: 'Floral Summer Dress',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Light and airy midi dress featuring a vibrant floral print and a flattering wrap silhouette.',
    brand: 'LuxeLine',
    category: 'Clothes',
    subcategory: 'Women',
    price: 1899,
    countInStock: 45,
    status: 'Approved',
    rating: 4.2,
    numReviews: 8
  },
  {
    name: 'Kids Graphic Pullover',
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Cozy and warm pullover hoodie with a fun graphic. Durable fabric for active kids.',
    brand: 'KidsWear',
    category: 'Clothes',
    subcategory: 'Kids',
    price: 1299,
    countInStock: 60,
    status: 'Approved',
    rating: 4.6,
    numReviews: 15
  },
  {
    name: 'Women\'s Yoga Leggings',
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593476123561-9516f2097158?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'High-waisted athletic leggings designed for maximum flexibility and moisture-wicking comfort.',
    brand: 'EcoFashion',
    category: 'Clothes',
    subcategory: 'Women',
    price: 1599,
    countInStock: 100,
    status: 'Approved',
    rating: 4.9,
    numReviews: 40
  },

  // --- SHOES ---
  {
    name: 'Classic Canvas Sneakers',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Timeless low-top canvas sneakers that go well with any casual outfit.',
    brand: 'UrbanStyle',
    category: 'Shoes',
    subcategory: 'Unisex',
    price: 1999,
    countInStock: 120,
    status: 'Approved',
    rating: 4.5,
    numReviews: 45
  },
  {
    name: 'Men\'s Running Shoes',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Lightweight performance running shoes with responsive cushioning and a breathable mesh upper.',
    brand: 'EcoFashion',
    category: 'Shoes',
    subcategory: 'Men',
    price: 4599,
    countInStock: 85,
    status: 'Approved',
    rating: 4.8,
    numReviews: 110
  },
  {
    name: 'Women\'s Leather Ankle Boots',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604136172511-7649520e2384?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515347265851-5c66041830dd?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Chic pointed-toe ankle boots crafted from premium genuine leather.',
    brand: 'LuxeLine',
    category: 'Shoes',
    subcategory: 'Women',
    price: 5999,
    countInStock: 40,
    status: 'Approved',
    rating: 4.6,
    numReviews: 24
  },
  {
    name: 'Unisex High-Top Trainers',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Retro-inspired high-top trainers featuring a durable rubber sole and ankle support.',
    brand: 'UrbanStyle',
    category: 'Shoes',
    subcategory: 'Unisex',
    price: 2999,
    countInStock: 65,
    status: 'Approved',
    rating: 4.4,
    numReviews: 32
  },
  {
    name: 'Kids Velcro Sneakers',
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515488042361-404e9253904d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Easy-on, easy-off sneakers with velcro straps, perfect for toddlers on the move.',
    brand: 'KidsWear',
    category: 'Shoes',
    subcategory: 'Kids',
    price: 1599,
    countInStock: 50,
    status: 'Approved',
    rating: 4.7,
    numReviews: 19
  },

  // --- WATCHES ---
  {
    name: 'Minimalist Black Dial Watch',
    images: [
      'https://images.unsplash.com/photo-1526045431048-f857369aba09?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Sleek and understated watch featuring a black dial and a genuine leather strap.',
    brand: 'Minimalist',
    category: 'Watches',
    subcategory: 'Unisex',
    price: 3999,
    countInStock: 60,
    status: 'Approved',
    rating: 4.7,
    numReviews: 88
  },
  {
    name: 'Luxury Silver Chronograph',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542496658-e32a6adcae50?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A premium stainless steel chronograph watch with precise quartz movement and water resistance.',
    brand: 'LuxeLine',
    category: 'Watches',
    subcategory: 'Men',
    price: 12999,
    countInStock: 15,
    status: 'Approved',
    rating: 4.9,
    numReviews: 120
  },
  {
    name: 'Rose Gold Women\'s Watch',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Elegant rose gold-tone watch with a mesh band and a minimalist white face.',
    brand: 'EcoFashion',
    category: 'Watches',
    subcategory: 'Women',
    price: 4599,
    countInStock: 40,
    status: 'Approved',
    rating: 4.6,
    numReviews: 45
  },
  {
    name: 'Sport Digital Smartwatch',
    images: [
      'https://images.unsplash.com/photo-1551816245-9adcfe581bad?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and smartphone notifications.',
    brand: 'UrbanStyle',
    category: 'Watches',
    subcategory: 'Unisex',
    price: 7999,
    countInStock: 100,
    status: 'Approved',
    rating: 4.5,
    numReviews: 210
  },
  {
    name: 'Classic Leather Strap Watch',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549993510-9c2b4870f089?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Traditional timepiece featuring Roman numerals and a rich brown leather band.',
    brand: 'Minimalist',
    category: 'Watches',
    subcategory: 'Men',
    price: 2499,
    countInStock: 80,
    status: 'Approved',
    rating: 4.3,
    numReviews: 34
  },

  // --- BAGS ---
  {
    name: 'Premium Leather Tote Bag',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575032617751-6ddec2089882?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Spacious and elegant tote bag crafted from genuine full-grain leather. Perfect for work or travel.',
    brand: 'LuxeLine',
    category: 'Bags',
    subcategory: 'Women',
    price: 6999,
    countInStock: 30,
    status: 'Approved',
    rating: 4.8,
    numReviews: 55
  },
  {
    name: 'Canvas Commuter Backpack',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546750248-a7df2dc286cf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551232864-3ef7a7c2a10d?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Durable canvas backpack featuring a padded laptop sleeve and multiple organizational pockets.',
    brand: 'UrbanStyle',
    category: 'Bags',
    subcategory: 'Unisex',
    price: 2499,
    countInStock: 100,
    status: 'Approved',
    rating: 4.6,
    numReviews: 112
  },
  {
    name: 'Chic Crossbody Bag',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594235041045-802ba2a7f920?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Compact and stylish crossbody bag with adjustable straps and secure zip closure.',
    brand: 'Minimalist',
    category: 'Bags',
    subcategory: 'Women',
    price: 1899,
    countInStock: 65,
    status: 'Approved',
    rating: 4.5,
    numReviews: 40
  },
  {
    name: 'Men\'s Leather Messenger Bag',
    images: [
      'https://images.unsplash.com/photo-1559599587-c5d012bf80b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581605405669-fdefc8c04916?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511405186001-f3b1a8f9f2b6?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A classic messenger bag combining professional style with practical functionality.',
    brand: 'LuxeLine',
    category: 'Bags',
    subcategory: 'Men',
    price: 5499,
    countInStock: 25,
    status: 'Approved',
    rating: 4.7,
    numReviews: 33
  },
  {
    name: 'Eco-Friendly Reusable Shopper',
    images: [
      'https://images.unsplash.com/photo-1597349141063-e5ef68f047ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622560480654-d96214fdc887?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550420455-813c6b299e52?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Sturdy, reusable shopping bag made entirely from recycled materials.',
    brand: 'EcoFashion',
    category: 'Bags',
    subcategory: 'Unisex',
    price: 499,
    countInStock: 300,
    status: 'Approved',
    rating: 4.4,
    numReviews: 89
  },

  // --- ACCESSORIES ---
  {
    name: 'Classic Aviator Sunglasses',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513673054901-2b5f51bc9a4d?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Iconic aviator sunglasses with polarized lenses for ultimate UV protection.',
    brand: 'UrbanStyle',
    category: 'Accessories',
    subcategory: 'Unisex',
    price: 1599,
    countInStock: 150,
    status: 'Approved',
    rating: 4.8,
    numReviews: 130
  },
  {
    name: 'Minimalist Leather Belt',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611095777244-13df933560bf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A simple, high-quality genuine leather belt that pairs seamlessly with jeans or trousers.',
    brand: 'Minimalist',
    category: 'Accessories',
    subcategory: 'Men',
    price: 999,
    countInStock: 200,
    status: 'Approved',
    rating: 4.6,
    numReviews: 75
  },
  {
    name: 'Silk Patterned Scarf',
    images: [
      'https://images.unsplash.com/photo-1601924990987-41e2a0950346?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Luxurious 100% silk scarf featuring a vibrant, artistic pattern.',
    brand: 'LuxeLine',
    category: 'Accessories',
    subcategory: 'Women',
    price: 2299,
    countInStock: 50,
    status: 'Approved',
    rating: 4.9,
    numReviews: 42
  },
  {
    name: 'Knit Winter Beanie',
    images: [
      'https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Cozy, ribbed knit beanie to keep you warm during cold winter days.',
    brand: 'EcoFashion',
    category: 'Accessories',
    subcategory: 'Unisex',
    price: 699,
    countInStock: 120,
    status: 'Approved',
    rating: 4.5,
    numReviews: 66
  },
  {
    name: 'Gold Hoop Earrings',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bf316403a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572426313455-19968d22415e?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Timeless 14k gold-plated hoop earrings, lightweight and elegant.',
    brand: 'LuxeLine',
    category: 'Accessories',
    subcategory: 'Women',
    price: 1899,
    countInStock: 80,
    status: 'Approved',
    rating: 4.7,
    numReviews: 58
  }
];

module.exports = products;
