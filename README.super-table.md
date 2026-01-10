SuperTable playground

What I implemented:
- A lightweight standalone `SuperTableComponent` in `project/superTable/` (types, component, scss)
- A playground in `src/app` with a mode menu and a handful of modes (Basic, Pagination, Sort, Dynamic Columns)
- A small demo dataset at `project/superTable/sample-data.ts`

How to run:
1. npm install
2. npm start
3. Open http://localhost:4200 and pick a mode

Notes / compatibility:
- Initially I attempted to use PrimeNG v19 but it required Angular 19 APIs that are not available in this Angular 18 app; installing primeng@19 caused build-time errors. To keep the demo running I replaced the p-table usage with a minimal internal table implementation. If you want the full PrimeNG-powered version, either upgrade to Angular 19 or add a compatible primeng package for Angular 18.
- The current `SuperTableComponent` aims to be a thin wrapper and demonstrates the API surface (config, data, events). It can be extended to use the real `p-table` when dependencies are aligned.

Next steps (optional):
- Add more modes (Row expansion, editors, column groups, frozen columns, export)
- Add support for custom cell templates via TemplateRef inputs
- Add comprehensive unit and play tests
