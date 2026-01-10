# superTable (demo)

Minimal standalone `SuperTableComponent` wrapper around PrimeNG `p-table`.

Files:
- `super-table.component.ts|html|scss` — standalone wrapper with a small API
- `super-table.types.ts` — config and column types
- `sample-data.ts` — small demo dataset

Usage (playground):
- Run `npm install` then `npm run start`
- Open http://localhost:4200 and pick a mode from the left menu

Notes / caveats:
- PrimeNG v19 is used, but the local theme import is omitted by default; add a theme of your choice to `src/styles.scss` (e.g., a PrimeNG or PrimeUix theme) if you want the official look.
- This is a starting point: more features (templating slots, editors, row expand, exports) can be added incrementally.
