export const NAV_LINKS = [
  { label: 'PRODUCTS', href: '/products', hasMega: true },
  { label: 'PROJECT', href: '/project', hasMega: false },
  { label: 'ABOUT', href: '/about', hasMega: false },
  { label: 'BESPOKE', href: '/bespoke', hasMega: false },
  { label: 'STORE', href: '/store', hasMega: false },
  { label: 'CONTACT', href: '/contact', hasMega: false },
];

export const MEGA_MENU = {
  byCategory: [
    { label: 'All', href: '/products' },
    { label: 'Sofa', href: '/products?category=sofa' },
    { label: 'Table', href: '/products?category=table' },
    { label: 'Chair', href: '/products?category=chair' },
    { label: 'Bed', href: '/products?category=bed' },
    { label: 'Storage', href: '/products?category=storage' },
    { label: 'Desk', href: '/products?category=desk' },
  ],
  bySpace: [
    { label: 'Living', href: '/products?category=sofa' },
    { label: 'Dining', href: '/products?category=table' },
    { label: 'Bedroom', href: '/products?category=bed' },
    { label: 'Office', href: '/products?category=desk' },
  ],
  special: [
    { label: 'Bespoke enquiry', href: '/bespoke' },
    { label: 'Project portfolio', href: '/project' },
    { label: 'Admin panel', href: '/admin/login' },
  ],
};
