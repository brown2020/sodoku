# Runtime budget

Stated before measurement (until-100 leanness):

- **Critical-path budget:** sum of `.next/static/**/*.js` bytes **excluding** the lazy
  jsPDF / PDF-export chunk after `npm run build` **≤ 1100 KB**.
- **Total static ceiling:** all `.next/static/**/*.js` (including optional PDF) **≤ 1600 KB**.
- **Critical path:** `start_new_game` / play loop on `/` (PDF export is off-path).
- Measure locally after production build; record bytes and pass/fail.
