import { WEDDING } from '../config/wedding';

export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type Prefix = (typeof PREFIXES)[number];

/** Collapse whitespace so "  Sanjaya   Perera " becomes "Sanjaya Perera". */
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * Combine prefix + guest name into the name shown to the guest.
 * "Dear" is a message-style option: it adds nothing to the name, because
 * the greeting already starts with "Dear".
 */
export function buildDisplayName(prefix: Prefix, guestName: string): string {
  const name = clean(guestName);
  if (!name) return '';
  switch (prefix) {
    case 'Family':
      return `${name} and Family`;
    case 'Dear':
      return name;
    default:
      return `${prefix} ${name}`;
  }
}

/** Greeting line for the WhatsApp message. Never produces "Dear Dear …". */
export function buildGreeting(displayName: string): string {
  const name = displayName.replace(/^dear\s+/i, '');
  return `Dear ${name} ❤️`;
}

/** {baseURL}/{displayName}, safely URL-encoded (spaces, &, etc.). */
export function buildInviteLink(baseUrl: string, displayName: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(displayName)}`;
}

export function buildInviteMessage(displayName: string, link: string): string {
  return `${buildGreeting(displayName)}

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${WEDDING.groomName} & ${WEDDING.brideName}`;
}

/** Read the personalised guest name from the URL path (e.g. /Mr.%20Sanjaya). */
export function getGuestNameFromPath(pathname: string = window.location.pathname): string {
  const segment = pathname.replace(/^\/+|\/+$/g, '').split('/')[0] || '';
  if (!segment || segment.toLowerCase() === 'admin') return '';
  try {
    return clean(decodeURIComponent(segment.replace(/\+/g, ' ')));
  } catch {
    return '';
  }
}
