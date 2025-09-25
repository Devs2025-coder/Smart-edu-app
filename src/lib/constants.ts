export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/faq', label: 'FAQs' },
];

export const USER_ROLES = [
  'Super Admin',
  'College Admin',
  'Professor',
  'Student',
];

export const USER_ROLE_MAP: { [key: string]: string } = {
  'super-admin': 'Super Admin',
  'college-admin': 'College Admin',
  'professor': 'Professor',
  'student': 'Student',
};
