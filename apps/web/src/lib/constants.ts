export const COMPANY = {
  name: 'STEADYWRK',
  legal: 'STEADYWRK LLC',
  legalName: 'STEADYWRK LLC',
  domain: 'steadywrk.app',
  url: 'https://steadywrk.app',
  email: 'hello@steadywrk.app',
  address: 'Building 15, King Hussein Business Park, Amman, Jordan',
  emails: {
    public: 'hello@steadywrk.app',
    admin: 'v@steadywrk.dev',
    privacy: 'privacy@steadywrk.app',
    legal: 'legal@steadywrk.app',
    noreply: 'noreply@steadywrk.app',
    hiring: 'hello@steadywrk.app',
  },
  social: {
    linkedin: 'https://steadywrk.app', // TODO: Update when LinkedIn page is live
    twitter: 'https://steadywrk.app', // TODO: Update when Twitter account is live
    instagram: 'https://instagram.com/swrk.jo', // Updated to match STE-23 Instagram handle
    whatsapp: '962770000000',
  },
  location: {
    address: 'Building 15, King Hussein Business Park',
    city: 'Amman',
    country: 'Jordan',
    countryCode: 'JO',
  },
} as const;

export const NAV_LINKS = [
  { href: '/careers', label: 'Careers' },
  { href: '/programs', label: 'Programs' },
  { href: '/about', label: 'About' },
  { href: '/culture', label: 'Culture' },
  { href: '/blog', label: 'Blog' },
] as const;
