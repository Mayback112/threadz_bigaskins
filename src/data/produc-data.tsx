export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    images: string[];
    sizes: string[];
    colors: string[];
    stock: number;
    rating: number;
    reviews: Review[];
    featured?: boolean;
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
}

export const products: Product[] = [
    {
        id: '1',
        name: 'Classic Cotton T-Shirt',
        description: 'Premium quality cotton t-shirt with a classic fit. Soft, breathable, and perfect for everyday wear.',
        price: 29.99,
        originalPrice: 39.99,
        category: 'Clothing',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Navy', 'Gray'],
        stock: 150,
        rating: 4.5,
        featured: true,
        reviews: [
            {
                id: 'r1',
                author: 'John Doe',
                rating: 5,
                comment: 'Perfect fit and great quality!',
                date: '2024-01-15',
            },
            {
                id: 'r2',
                author: 'Jane Smith',
                rating: 4,
                comment: 'Love the material, runs slightly large.',
                date: '2024-01-10',
            },
        ],
    },
    {
        id: '2',
        name: 'Premium Leather Wallet',
        description: 'Handcrafted genuine leather wallet with multiple card slots and a spacious bill compartment.',
        price: 79.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
        images: [
            'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
            'https://images.unsplash.com/photo-1591336256991-4bf726f10fa0?w=800',
        ],
        sizes: ['One Size'],
        colors: ['Brown', 'Black', 'Tan'],
        stock: 85,
        rating: 4.8,
        featured: true,
        reviews: [
            {
                id: 'r3',
                author: 'Mike Johnson',
                rating: 5,
                comment: 'Best wallet I\'ve ever owned. Quality is exceptional.',
                date: '2024-02-01',
            },
        ],
    },
    {
        id: '3',
        name: 'Wireless Bluetooth Headphones',
        description: 'High-fidelity wireless headphones with active noise cancellation and 30-hour battery life.',
        price: 199.99,
        originalPrice: 249.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'White', 'Rose Gold'],
        stock: 45,
        rating: 4.7,
        featured: true,
        reviews: [
            {
                id: 'r4',
                author: 'Sarah Williams',
                rating: 5,
                comment: 'Amazing sound quality and comfortable for long listening sessions.',
                date: '2024-01-20',
            },
            {
                id: 'r5',
                author: 'David Brown',
                rating: 4,
                comment: 'Great headphones, but a bit pricey.',
                date: '2024-01-18',
            },
        ],
    },
    {
        id: '4',
        name: 'Slim Fit Denim Jeans',
        description: 'Modern slim fit jeans crafted from premium stretch denim for comfort and style.',
        price: 89.99,
        category: 'Clothing',
        image: 'https://images.unsplash.com/photo-1542272454315-7ad9f8338b8e?w=800',
        images: [
            'https://images.unsplash.com/photo-1542272454315-7ad9f8338b8e?w=800',
            'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800',
        ],
        sizes: ['28', '30', '32', '34', '36', '38'],
        colors: ['Dark Blue', 'Light Blue', 'Black'],
        stock: 120,
        rating: 4.6,
        reviews: [
            {
                id: 'r6',
                author: 'Emily Davis',
                rating: 5,
                comment: 'Perfect fit and very comfortable!',
                date: '2024-02-05',
            },
        ],
    },
    {
        id: '5',
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
        price: 34.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        images: [
            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
            'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800',
        ],
        sizes: ['500ml', '750ml', '1L'],
        colors: ['Silver', 'Black', 'Blue', 'Rose Gold'],
        stock: 200,
        rating: 4.9,
        reviews: [
            {
                id: 'r7',
                author: 'Alex Martinez',
                rating: 5,
                comment: 'Keeps my water ice cold all day. Love it!',
                date: '2024-02-10',
            },
        ],
    },
    {
        id: '6',
        name: 'Minimalist Backpack',
        description: 'Sleek and functional backpack with padded laptop compartment and water-resistant exterior.',
        price: 129.99,
        category: 'Bags',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
            'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Gray', 'Navy'],
        stock: 60,
        rating: 4.7,
        featured: true,
        reviews: [
            {
                id: 'r8',
                author: 'Chris Lee',
                rating: 5,
                comment: 'Perfect size and very durable. Highly recommend!',
                date: '2024-01-25',
            },
        ],
    },
    {
        id: '7',
        name: 'Athletic Running Shoes',
        description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
        price: 119.99,
        originalPrice: 149.99,
        category: 'Footwear',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
        ],
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Red', 'Blue'],
        stock: 90,
        rating: 4.8,
        reviews: [
            {
                id: 'r9',
                author: 'Rachel Green',
                rating: 5,
                comment: 'Super comfortable and great for long runs!',
                date: '2024-02-08',
            },
        ],
    },
    {
        id: '8',
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life.',
        price: 299.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
            'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
        ],
        sizes: ['Small', 'Medium', 'Large'],
        colors: ['Black', 'Silver', 'Gold'],
        stock: 75,
        rating: 4.6,
        reviews: [
            {
                id: 'r10',
                author: 'Tom Anderson',
                rating: 4,
                comment: 'Great features, but takes time to learn all functions.',
                date: '2024-02-12',
            },
        ],
    },
];

export const categories = [
    { name: 'Clothing', count: 150, image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800' },
    { name: 'Electronics', count: 85, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800' },
    { name: 'Accessories', count: 120, image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800' },
    { name: 'Footwear', count: 95, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800' },
    { name: 'Bags', count: 65, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
    { name: 'Home', count: 110, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800' },
];
