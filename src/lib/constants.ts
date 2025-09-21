export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/faq', label: 'FAQs' },
];

export const USER_ROLES = [
  'Super Admin',
  'College Admin',
  'School Admin',
  'Professor',
  'Teacher',
  'Student',
  'Parent',
];

export const USER_ROLE_MAP: { [key: string]: string } = {
  'super-admin': 'Super Admin',
  'college-admin': 'College Admin',
  'school-admin': 'School Admin',
  professor: 'Professor',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
};
