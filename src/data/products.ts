export interface Product {
  id: string;
  name: string;
  category: 'sneakers' | 'tshirts' | 'pants' | 'sweaters' | 'accessories';
  price: number;
  originalPrice?: number; // Prix avant remise
  discount?: number; // Pourcentage de remise
  description: string;
  size?: string;
  sizes?: string[];
  color?: string;
  colors?: string[];
  images: string[];
  featured?: boolean;
  inStock: boolean;
  new?: boolean;
  rating: number;
  reviews: number;
  numReviews?: number; // Alias de reviews pour compatibilité
  countInStock?: number; // Alias de inStock pour compatibilité
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Nike Air Max 90',
    price: 150,
    originalPrice: 180,
    discount: 15,
    description: 'The Nike Air Max 90 remains a popular choice for sneakerheads and casual wearers alike. This iconic design features Max Air cushioning in the heel for comfort, padded collar for a snug fit, and a variety of colorways to choose from.',
    category: 'sneakers',
    images: [
      'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=1887&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop'
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['black', 'white', 'red'],
    rating: 4.8,
    reviews: 245,
    inStock: true,
    countInStock: 25,
    featured: true
  },
  {
    id: '2',
    name: 'Adidas Ultraboost 22',
    price: 180,
    description: 'Experience incredible energy return with adidas Ultraboost 22. These running shoes combine responsive cushioning with a supportive fit for a comfortable run or all-day wear.',
    category: 'sneakers',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=2131&auto=format&fit=crop'
    ],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    colors: ['black', 'grey', 'blue'],
    rating: 4.7,
    reviews: 187,
    countInStock: 18,
    inStock: true
  },
  {
    id: '3',
    name: 'Supreme Box Logo T-Shirt',
    price: 120,
    originalPrice: 150,
    discount: 20,
    description: 'The classic Supreme Box Logo T-Shirt is a streetwear staple. This cotton tee features the iconic box logo on the front and a comfortable fit that works for any casual outfit.',
    category: 'tshirts',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=1974&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['white', 'black', 'red'],
    rating: 4.9,
    reviews: 312,
    countInStock: 32,
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Off-White Industrial Belt',
    price: 220,
    description: 'Make a statement with the Off-White Industrial Belt. This signature accessory features the brand\'s bold diagonal stripes and industrial-inspired design elements.',
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1495857000853-fe46c8aefc30?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1974&auto=format&fit=crop'
    ],
    colors: ['yellow', 'black'],
    rating: 4.6,
    reviews: 98,
    countInStock: 10,
    inStock: true
  },
  {
    id: '5',
    name: 'Bape Shark Hoodie',
    price: 350,
    originalPrice: 400,
    discount: 12.5,
    description: 'The BAPE Shark Hoodie is a streetwear legend with its instantly recognizable shark face design and full zip-up hood. Made with premium fabric for comfort and style.',
    category: 'sweaters',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1887&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=1974&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['camo green', 'black', 'blue'],
    rating: 4.9,
    reviews: 157,
    countInStock: 15,
    inStock: true,
    featured: true
  },
  {
    id: '6',
    name: 'Fear of God Essentials Sweatpants',
    price: 110,
    description: 'Fear of God Essentials Sweatpants offer premium comfort with a minimalist aesthetic. These versatile pants feature a relaxed fit and subtle branding.',
    category: 'pants',
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1854&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560294559-1774a164fb0a?q=80&w=1976&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['grey', 'black', 'tan'],
    rating: 4.7,
    reviews: 124,
    countInStock: 22,
    inStock: true
  },
  {
    id: '7',
    name: 'Jordan 1 Retro High',
    price: 190,
    originalPrice: 220,
    discount: 15,
    description: 'The Air Jordan 1 Retro High is the shoe that started it all. This iconic sneaker features classic colorways that never go out of style, premium leather uppers, and Air-Sole cushioning for comfort.',
    category: 'sneakers',
    images: [
      'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600181516264-3ea807ff44b9?q=80&w=2070&auto=format&fit=crop'
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['red/black', 'white/blue', 'black/white'],
    rating: 4.9,
    reviews: 325,
    inStock: true,
    featured: true
  },
  {
    id: '8',
    name: 'Stüssy Logo Tee',
    price: 85,
    description: 'A classic Stüssy t-shirt featuring the iconic logo. Made from 100% cotton for enhanced comfort and durability, this tee is a versatile addition to any streetwear collection.',
    category: 'tshirts',
    images: [
      'https://images.unsplash.com/photo-1588099768531-a72d4a198538?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=1974&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['white', 'black', 'navy'],
    rating: 4.6,
    reviews: 168,
    inStock: true
  },
  {
    id: '9',
    name: 'Yeezy Slide',
    price: 70,
    originalPrice: 90,
    discount: 22,
    description: 'The Yeezy Slide offers ultimate comfort with its injected EVA foam construction. Its minimalist design features a thick footbed and a comfortable strap for a secure fit.',
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1780&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613331455414-2b9c4371c8dc?q=80&w=1974&auto=format&fit=crop'
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['bone', 'desert sand', 'resin'],
    rating: 4.5,
    reviews: 203,
    inStock: true,
    featured: false
  },
  {
    id: '10',
    name: 'The North Face Puffer Jacket',
    price: 280,
    description: 'Stay warm and stylish with this The North Face Puffer Jacket. Featuring 550-fill down insulation, a water-repellent finish, and a modern silhouette that\'s become a streetwear staple.',
    category: 'sweaters',
    images: [
      'https://images.unsplash.com/photo-1611731634614-63db9710d7c6?q=80&w=1887&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605908502724-9093a79a1b39?q=80&w=1974&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'navy', 'red'],
    rating: 4.8,
    reviews: 142,
    inStock: true,
    new: true
  },
  {
    id: '11',
    name: 'Carhartt WIP Cargo Pants',
    price: 130,
    description: 'Carhartt WIP Cargo Pants combine workwear durability with street style. These pants feature multiple pockets, relaxed fit, and hard-wearing cotton canvas construction.',
    category: 'pants',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=1974&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['brown', 'black', 'olive'],
    rating: 4.7,
    reviews: 98,
    inStock: true
  },
  {
    id: '12',
    name: 'Casquette New Era 9FORTY',
    price: 35,
    originalPrice: 45,
    discount: 22,
    description: 'La casquette New Era 9FORTY offre un style sport urbain avec son design ajustable. Parfaite pour compléter n\'importe quelle tenue streetwear.',
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1970&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620917669809-1af0497965e1?q=80&w=2070&auto=format&fit=crop'
    ],
    colors: ['black', 'navy', 'red'],
    rating: 4.5,
    reviews: 76,
    inStock: true
  }
];

// Initialiser les propriétés numReviews pour compatibilité
products.forEach(product => {
  product.numReviews = product.reviews;
  product.countInStock = product.countInStock || (product.inStock ? 20 : 0);
});

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured === true);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Fonction pour récupérer les produits en réduction
export const getDiscountedProducts = (): Product[] => {
  return products.filter(product => product.discount !== undefined && product.discount > 0);
};

// Nouvelles fonctions pour la recherche et les avis
export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) || 
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
};

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  text: string;
  date: string;
}

export const productReviews: Record<string, Review[]> = {
  '1': [
    {
      id: '101',
      userId: 'user1',
      userName: 'Thomas D.',
      productId: '1',
      rating: 5,
      text: 'Ces Nike Air Max sont incroyables. Super confortables et le style est parfait !',
      date: '2023-05-15'
    },
    {
      id: '102',
      userId: 'user2',
      userName: 'Sophie L.',
      productId: '1',
      rating: 4,
      text: 'Très bonnes chaussures, mais un peu serrées au début. Après quelques jours, elles se sont adaptées à mes pieds.',
      date: '2023-06-22'
    },
    {
      id: '103',
      userId: 'user7',
      userName: 'Julien M.',
      productId: '1',
      rating: 5,
      text: 'Exactement ce que je cherchais. Le coloris est magnifique et elles sont très confortables dès le premier jour.',
      date: '2023-11-05'
    }
  ],
  '2': [
    {
      id: '201',
      userId: 'user3',
      userName: 'Marc B.',
      productId: '2',
      rating: 5,
      text: 'Les Ultraboost sont les meilleures chaussures de running que j\'ai jamais portées !',
      date: '2023-04-10'
    },
    {
      id: '202',
      userId: 'user8',
      userName: 'Céline P.',
      productId: '2',
      rating: 4,
      text: 'Excellent confort pour les longues journées. Je les utilise aussi bien pour courir que pour le quotidien.',
      date: '2023-10-18'
    }
  ],
  '3': [
    {
      id: '301',
      userId: 'user4',
      userName: 'Julia M.',
      productId: '3',
      rating: 5,
      text: 'T-shirt de qualité exceptionnelle, je le recommande à tous les amateurs de streetwear.',
      date: '2023-07-05'
    },
    {
      id: '302',
      userId: 'user5',
      userName: 'Alex R.',
      productId: '3',
      rating: 4,
      text: 'Très beau t-shirt, mais attention à la taille qui est un peu plus petite que prévu.',
      date: '2023-08-14'
    }
  ],
  '5': [
    {
      id: '501',
      userId: 'user6',
      userName: 'Nicolas P.',
      productId: '5',
      rating: 5,
      text: 'Ce hoodie est incroyable, la qualité est excellente et le design est unique.',
      date: '2023-09-20'
    },
    {
      id: '502',
      userId: 'user9',
      userName: 'Léa T.',
      productId: '5',
      rating: 5,
      text: 'Je l\'attendais depuis longtemps et il ne m\'a pas déçue. La coupe est parfaite et le tissu très doux.',
      date: '2023-12-04'
    }
  ],
  '7': [
    {
      id: '701',
      userId: 'user10',
      userName: 'Maxime D.',
      productId: '7',
      rating: 5,
      text: 'Les Jordan 1 sont tout simplement mythiques. Qualité impeccable, elles se bonifient avec le temps.',
      date: '2023-10-15'
    },
    {
      id: '702',
      userId: 'user11',
      userName: 'Sarah K.',
      productId: '7',
      rating: 5,
      text: 'J\'adore cette paire ! Le colorway est encore plus beau en vrai que sur les photos.',
      date: '2023-11-23'
    }
  ],
  '9': [
    {
      id: '901',
      userId: 'user12',
      userName: 'Lucas M.',
      productId: '9',
      rating: 4,
      text: 'Les Yeezy Slides sont extrêmement confortables, parfaites pour l\'été. Prenez une taille au-dessus.',
      date: '2023-08-07'
    }
  ],
  '10': [
    {
      id: '1001',
      userId: 'user13',
      userName: 'Emma B.',
      productId: '10',
      rating: 5,
      text: 'Cette doudoune est parfaite pour l\'hiver. Très chaude mais pas trop volumineuse.',
      date: '2023-12-10'
    }
  ]
};

export const getProductReviews = (productId: string): Review[] => {
  return productReviews[productId] || [];
}; 