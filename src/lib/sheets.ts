import { APPS_SCRIPT_URL } from '../config/wedding';

export type SheetKey = 'RSVP' | 'WISHES';

/**
 * Send a row to the Google Apps Script web app.
 * Uses application/x-www-form-urlencoded + no-cors so the browser sends a
 * "simple" request (no CORS preflight, which Apps Script does not support).
 * The response is opaque, so a resolved promise means "sent".
 */
export async function submitToSheet(sheet: SheetKey, data: Record<string, string>): Promise<void> {
  if (!APPS_SCRIPT_URL) {
    throw new Error('VITE_GOOGLE_APPS_SCRIPT_URL is not configured.');
  }
  const body = new URLSearchParams({ sheet, ...data });
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: body.toString(),
  });
}
