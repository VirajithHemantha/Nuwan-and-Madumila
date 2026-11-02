/**
 * Nuwan & Madhumila — Wedding RSVP + Wishes backend (Google Apps Script)
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BpuBO2D7z7poa7VnrP6XrHWirM5bkYamGvIvxtMGPl8/edit
 *
 * The "RSVP" and "Wishes" tabs (with styled headers) are created automatically
 * on the first submission — or run setupSheets() once from the editor.
 */

const SPREADSHEET_ID = '1BpuBO2D7z7poa7VnrP6XrHWirM5bkYamGvIvxtMGPl8';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Phone', 'Attendance', 'Guests', 'Message / Notes', 'Invited As'],
    widths: [170, 200, 140, 130, 80, 320, 180],
    row: function (p) {
      return [
        new Date(),
        p.name || '',
        p.phone || '',
        p.attendance || '',
        p.attendance === 'Declined' ? 0 : Number(p.guests || 1),
        p.notes || '',
        p.invitedAs || '',
      ];
    },
  },
  WISHES: {
    name: 'Wishes',
    headers: ['Timestamp', 'Name', 'Wish / Message', 'Invited As'],
    widths: [170, 200, 460, 180],
    row: function (p) {
      return [new Date(), p.name || '', p.message || '', p.invitedAs || ''];
    },
  },
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const payload = parsePayload_(e);
    let key = String(payload.sheet || '').toUpperCase();
    if (key === 'WISH') key = 'WISHES'; // backwards compatibility

    const config = SHEETS[key];
    if (!config) {
      return jsonResponse_({ ok: false, error: 'Invalid sheet. Use RSVP or WISHES.' });
    }

    const sheet = getOrCreateSheet_(config);
    sheet.appendRow(config.row(payload).map(sanitize_));

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function doGet() {
  return jsonResponse_({ ok: true, message: 'Nuwan & Madhumila wedding endpoint is running.' });
}

/** Run once manually (optional) to create both tabs with headers. */
function setupSheets() {
  Object.keys(SHEETS).forEach(function (k) { getOrCreateSheet_(SHEETS[k]); });
}

function getOrCreateSheet_(config) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(config.name);
  if (!sheet) sheet = ss.insertSheet(config.name);

  if (sheet.getLastRow() === 0) {
    const header = sheet.getRange(1, 1, 1, config.headers.length);
    header.setValues([config.headers])
      .setFontWeight('bold')
      .setFontColor('#ffffff')
      .setBackground('#7a5c3e')
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 32);
    config.widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  }
  return sheet;
}

/** Prevent formula injection (values starting with = + - @ are stored as text). */
function sanitize_(value) {
  if (typeof value === 'string' && /^[=+\-@]/.test(value)) return "'" + value;
  return value;
}

function parsePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};
  if (Object.keys(params).length > 0) return params;

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) return {};
  try {
    return JSON.parse(contents);
  } catch (_) {
    return {};
  }
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
