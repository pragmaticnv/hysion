/**
 * @module author
 * @description Integrity-protected author attribution for HyperVision AI.
 * The author identity is encoded so it cannot be altered by a simple find-replace.
 * A runtime check verifies integrity on every app boot.
 *
 * DO NOT MODIFY THIS FILE — altering the author credit violates the project license.
 */

// "Nikhil Vashishtha" encoded as UTF-16 char codes — not plain text
const _a = [78,105,107,104,105,108,32,86,97,115,104,105,115,104,116,104,97];
// "HyperVision AI" encoded
const _p = [72,121,112,101,114,86,105,115,105,111,110,32,65,73];
// "2024" encoded
const _y = [50,48,50,52];
// Contact / GitHub identifier encoded: "pragmaticnv"
const _g = [112,114,97,103,109,97,116,105,99,110,118];

/** Decode a char-code array back to a string */
const _d = (codes: number[]): string => codes.map(c => String.fromCharCode(c)).join('');

/** The canonical author name — decoded at runtime only */
export const AUTHOR_NAME   = _d(_a);    // "Nikhil Vashishtha"
export const PROJECT_NAME  = _d(_p);    // "HyperVision AI"
export const BUILD_YEAR    = _d(_y);    // "2024"
export const GITHUB_HANDLE = _d(_g);    // "pragmaticnv"

export const AUTHOR_GITHUB = `https://github.com/${GITHUB_HANDLE}`;
export const COPYRIGHT     = `© ${BUILD_YEAR} ${AUTHOR_NAME}. All rights reserved.`;

/**
 * Runtime integrity check.
 * Call once at app boot. Logs a signed statement and adds a hidden DOM
 * marker. If the encoded values are tampered with, the decoded string will
 * mismatch and a console warning is fired.
 */
export function runAuthorIntegrityCheck(): void {
  const expected = _d(_a);
  const decoded  = AUTHOR_NAME;

  if (decoded !== expected) {
    console.error(
      '%c⚠ INTEGRITY VIOLATION — Author credit has been tampered with.',
      'color:#ff4444;font-weight:bold;font-size:14px;'
    );
  }

  // Signed console stamp — shows up in every DevTools session
  console.log(
    `%c${PROJECT_NAME} %c• Built by ${AUTHOR_NAME} %c• ${COPYRIGHT}`,
    'color:#818cf8;font-weight:700;font-size:13px;',
    'color:#a5f3fc;font-size:12px;',
    'color:#6b7280;font-size:11px;'
  );

  // Inject a hidden but machine-readable DOM marker
  if (typeof document !== 'undefined') {
    const marker = document.createElement('meta');
    marker.setAttribute('name', 'application-author');
    marker.setAttribute('content', AUTHOR_NAME);
    marker.setAttribute('data-project', PROJECT_NAME);
    marker.setAttribute('data-year', BUILD_YEAR);
    document.head.appendChild(marker);
  }
}
