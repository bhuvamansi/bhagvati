import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import Product from './models/Product.js';
import Admin from './models/Admin.js';
import Project from './models/Project.js';
import Archive from './models/Archive.js';
import SiteSettings from './models/SiteSettings.js';
import FAQ from './models/FAQ.js';
import DeliveryBoy from './models/DeliveryBoy.js';

dotenv.config();

const image = (url, alt = '') => ({ url, alt });

const products = [
  {
    name: 'Aarav Teak Sofa',
    shortDescription: 'Hand-finished teakwood sofa with premium neutral upholstery.',
    description:
      'A signature living-room piece designed for Indian homes, balancing generous comfort with clean craftsmanship and durable finishing.',
    price: 68500,
    priceLabel: '₹68,500',
    images: [image('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&auto=format&fit=crop')],
    category: 'sofa',
    material: 'fabric',
    roomCategory: 'living',
    featured: true,
    inStock: true,
    status: 'published',
    dimensions: { width: 220, depth: 95, height: 82, unit: 'cm' },
    specifications: [{ label: 'Finish', value: 'Natural matte' }, { label: 'Lead time', value: '3-4 weeks' }],
  },
  {
    name: 'Bhavya Dining Table',
    shortDescription: 'Solid walnut dining table with clean architectural lines.',
    description:
      'Crafted for family dining and premium hospitality spaces, this table delivers warmth, durability, and a timeless visual language.',
    price: 92500,
    priceLabel: '₹92,500',
    images: [image('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop')],
    category: 'table',
    material: 'walnut',
    roomCategory: 'dining',
    featured: true,
    inStock: true,
    status: 'published',
    dimensions: { width: 240, depth: 100, height: 76, unit: 'cm' },
  },
  {
    name: 'Nirali Accent Chair',
    shortDescription: 'Comfort-driven accent chair with sculpted profile and soft curves.',
    description:
      'A premium accent chair that works equally well in lounge corners, reception areas, and master bedrooms.',
    price: 28500,
    priceLabel: '₹28,500',
    images: [image('https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1200&q=80&auto=format&fit=crop')],
    category: 'chair',
    material: 'leather',
    roomCategory: 'living',
    featured: false,
    inStock: true,
    status: 'published',
  },
  {
    name: 'Ved Platform Bed',
    shortDescription: 'Minimal platform bed designed for calm, luxurious bedrooms.',
    description:
      'A low-profile bed with clean proportions, rich wood grain, and sturdy construction for long-term use.',
    price: 78500,
    priceLabel: '₹78,500',
    images: [image('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop')],
    category: 'bed',
    material: 'oak',
    roomCategory: 'bedroom',
    featured: true,
    inStock: true,
    status: 'published',
  },
  {
    name: 'Sattva Storage Console',
    shortDescription: 'Premium storage console for dining and living spaces.',
    description:
      'Combining display shelving and concealed storage, this piece brings order and elegance to premium interiors.',
    price: 54500,
    priceLabel: '₹54,500',
    images: [image('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop')],
    category: 'storage',
    material: 'oak',
    roomCategory: 'dining',
    featured: false,
    inStock: true,
    status: 'published',
  },
  {
    name: 'Kriya Work Desk',
    shortDescription: 'Executive desk with refined form and practical workspace.',
    description:
      'Designed for productive home offices and studio spaces with elegant detailing and robust tabletop support.',
    price: 41250,
    priceLabel: '₹41,250',
    images: [image('https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=80&auto=format&fit=crop')],
    category: 'desk',
    material: 'walnut',
    roomCategory: 'office',
    featured: false,
    inStock: true,
    status: 'published',
  },
];

const projects = [
  {
    title: 'Ahmedabad Family Residence',
    summary: 'Warm residential installation featuring bespoke teak and upholstery pieces.',
    description:
      'A premium residential furnishing project focused on living, dining, and bedroom spaces with a cohesive wood palette.',
    coverImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop',
    images: [image('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop')],
    category: 'residential',
    location: 'Ahmedabad, Gujarat',
    year: 2025,
    featured: true,
    status: 'published',
  },
  {
    title: 'Boutique Villa Interior',
    summary: 'Premium villa project with layered textures and custom furniture detailing.',
    description:
      'A full-house furniture curation with lounge seating, dining statement pieces, and tailored bedroom solutions.',
    coverImage: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80&auto=format&fit=crop',
    images: [image('https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80&auto=format&fit=crop')],
    category: 'residential',
    location: 'Surat, Gujarat',
    year: 2024,
    featured: true,
    status: 'published',
  },
];

const archives = [
  {
    title: 'Craftsmanship Journal 2026',
    type: 'press',
    excerpt: 'A closer look at our teak finishing, upholstery detailing, and material-first design process.',
    content: 'Shree Bhagvati Furniture builds timeless furniture through careful material selection, hand-finishing, and practical design for Indian homes.',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80&auto=format&fit=crop',
    status: 'published',
    featured: true,
  },
  {
    title: 'Exhibition Highlights',
    type: 'exhibition',
    excerpt: 'Key pieces presented in our latest furniture showcase.',
    content: 'Featured living, dining, and bedroom pieces that reflect our approach to warm contemporary interiors.',
    coverImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop',
    status: 'published',
  },
];

const faqs = [
  {
    category: 'general',
    question: 'Do you deliver across India?',
    answer: 'Yes. We support delivery across major Indian cities and coordinate logistics project by project.',
  },
  {
    category: 'customization',
    question: 'Can I request custom dimensions and finishes?',
    answer: 'Yes. Bespoke orders are supported for many designs depending on material availability and production schedule.',
  },
];

const adminUser = {
  name: 'Super Admin',
  email: 'admin@shreebhagvatifurniture.com',
  password: 'Admin@1234',
  role: 'superadmin',
};

const settings = {
  brandName: 'Shree Bhagvati Furniture',
  brandTagline: 'Bridging Craft, Comfort, and Contemporary Indian Living.',
  contactEmail: 'info@shreebhagvatifurniture.com',
  contactPhone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  address: 'Ahmedabad, Gujarat, India',
  mapLink: 'https://maps.google.com',
  showroomHours: 'Mon - Sat | 10:00 AM - 8:00 PM',
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    pinterest: 'https://pinterest.com',
    youtube: 'https://youtube.com',
  },
  footerText: 'Premium furniture collections, bespoke solutions, and project consultation for Indian interiors.',
  seo: {
    metaTitle: 'Shree Bhagvati Furniture',
    metaDescription: 'Premium furniture website built on MERN with admin CMS and authentication.',
  },
};

const deliveryBoys = [
  {
    name: 'Rahul Patel',
    email: 'rahul.delivery@bhagvati.com',
    password: 'Rahul@12345',
    phone: '9876543210',
    isActive: true,
    isAvailable: true,
  },
  {
    name: 'Amit Sharma',
    email: 'amit.delivery@bhagvati.com',
    password: 'Amit@12345',
    phone: '9876543211',
    isActive: true,
    isAvailable: true,
  },
  {
    name: 'Vikas Yadav',
    email: 'vikas.delivery@bhagvati.com',
    password: 'Vikas@12345',
    phone: '9876543212',
    isActive: true,
    isAvailable: true,
  },
  {
    name: 'Sanjay Kumar',
    email: 'sanjay.delivery@bhagvati.com',
    password: 'Sanjay@12345',
    phone: '9876543213',
    isActive: true,
    isAvailable: true,
  },
  {
    name: 'Manoj Verma',
    email: 'manoj.delivery@bhagvati.com',
    password: 'Manoj@12345',
    phone: '9876543214',
    isActive: true,
    isAvailable: true,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      Product.deleteMany(),
      Admin.deleteMany(),
      Project.deleteMany(),
      Archive.deleteMany(),
      SiteSettings.deleteMany(),
      FAQ.deleteMany(),
      DeliveryBoy.deleteMany(),
    ]);

    await Admin.create(adminUser);
    await Product.insertMany(products);
    await Project.insertMany(projects);
    await Archive.insertMany(archives);
    await FAQ.insertMany(faqs);
    await SiteSettings.create(settings);

    // create() so password hooks run
    for (const person of deliveryBoys) {
      await DeliveryBoy.create(person);
    }

    console.log('Seed completed successfully.');
    console.log('Admin email   : admin@shreebhagvatifurniture.com');
    console.log('Admin password: Admin@1234');

    console.log('\nDelivery Logins:');
    deliveryBoys.forEach((boy, index) => {
      console.log(`${index + 1}. ${boy.email} | ${boy.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();