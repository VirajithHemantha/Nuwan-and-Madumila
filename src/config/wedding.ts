// Single source of truth for all wedding details shown on the invitation,
// the admin link generator and the Google Sheets integration.

export const WEDDING = {
  groomName: 'Nuwan',
  brideName: 'Madhumila',

  groomParents: 'Mr. A.G. Gunasena & Mrs. A.P. Deepa Shanthi',
  brideParents: 'Mr. K.D.M.D. Senarathna & Mrs. Y.G. Hemalatha',

  // Friday, 11 December 2026 — Poruwa ceremony at 10:06 AM (Sri Lanka time)
  date: new Date('2026-12-11T10:06:00+05:30'),
  dateNumeric: '11 . 12 . 2026',
  dateLong: 'Friday, December 11',
  dateShort: 'December 11, 2026',
  yearInWords: 'The Year Two Thousand Twenty Six',
  monthYear: 'December 2026',

  poruwaTime: '10:06 AM',
  eventTime: '10:00 AM – 4:00 PM',
  eventStart: '10:00 AM',
  eventEnd: '04:00 PM',

  venueName: 'Oak Ray Regency',
  venueArea: 'Gatambe, Kandy',
  mapsUrl: 'https://maps.app.goo.gl/5V3PxocATb3jmrRC8',
} as const;

export const COUPLE_NAMES = `${WEDDING.groomName} & ${WEDDING.brideName}`;

// Google Apps Script web app URL (set VITE_GOOGLE_APPS_SCRIPT_URL in .env / hosting env vars)
export const APPS_SCRIPT_URL = (import.meta.env?.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined) || '';
