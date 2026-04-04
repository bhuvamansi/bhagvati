export const BRAND = {
  name: 'Shree Bhagvati Furniture',
  tagline: 'Bridging Craft, Comfort, and Contemporary Indian Living.',
  phone: '+91 98765 43210',
  email: 'info@shreebhagvatifurniture.com',
  address: 'Ahmedabad, Gujarat, India',
  registration: 'GST and business details managed by owner',
  locations: ['Ahmedabad', 'Surat', 'Vadodara'],
  social: {
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
    youtube: 'https://youtube.com',
  },
};

export const FOOTER_COLUMNS = [
  {
    heading: 'Products',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Sofas', href: '/products?category=sofa' },
      { label: 'Tables', href: '/products?category=table' },
      { label: 'Chairs', href: '/products?category=chair' },
      { label: 'Beds', href: '/products?category=bed' },
    ],
  },
  {
    heading: 'Client Service',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Bespoke Inquiry', href: '/bespoke' },
      { label: 'Store', href: '/store' },
      { label: 'FAQs', href: '/contact' },
    ],
  },
  {
    heading: 'Admin',
    links: [
      { label: 'Admin Login', href: '/admin/login' },
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Newsletter', href: '/admin/newsletter' },
    ],
  },
];
