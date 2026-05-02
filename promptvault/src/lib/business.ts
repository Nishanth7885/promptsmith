// Business identity + contact info. Single source of truth used by the
// about / contact / refund / return pages, the footer, and any email
// signatures or invoices that need merchant details for Cashfree compliance.

export const BUSINESS = {
  brand: 'Prompt Smith',
  legalName: 'Pazhaniswamy Sundhar Ganesh',
  ownerTitle: 'Sole Proprietor',
  domain: 'promptsmith.ink',

  email: 'digitalhub.admin@gmail.com',
  phone: '+91 73395 45363',
  phoneRaw: '+917339545363',
  whatsapp: '+91 73395 45363',
  whatsappRaw: '917339545363',

  address: {
    line1: '1/18, Palayyur',
    line2: 'P.N. Palayam',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    postal: '641037',
    country: 'India',
  },

  hours: 'Monday – Saturday, 10:00 AM – 7:00 PM IST',

  policyEffectiveDate: '2 May 2026',
} as const;

export const formattedAddress = [
  BUSINESS.address.line1,
  BUSINESS.address.line2,
  `${BUSINESS.address.city}, ${BUSINESS.address.state} – ${BUSINESS.address.postal}`,
  BUSINESS.address.country,
].join(', ');
