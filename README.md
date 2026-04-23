# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


A small invoice management app built with Vite + React
SETUP
- Install Dependencies
- Run dev server (npm run dev)
- Build/Preview (npm run build
  npm run preview)

ARCHITECTURE
Entry Point: main.jsx - App.jsx
Global Providers:
- UI theme: ThemeProvider/useTheme
- invoices data: InvoiceProvider/useInvoices
Pages:
- InvoiceListPage
- InvoiceDetailPage
UI components:
- Sidebar
- InvoiceForm
- DeleteModal
- StatusBadge
Utilities:
- ID generation: generateid
- Validation: validateInvoice
- Dates: formatDate, calcDueDate
- Currency formatting: formatCurrency

Trade-offs / decisions
Local-first: using localStorage (simple CLI-free demo) vs a backend — chosen for simplicity and offline use. See InvoiceContext.jsx.
ID generation: generateId creates readable IDs but is not collision-proof for large datasets.
Validation: client-side via validateInvoice. Server-side validation would still be required in a production backend.
Dates: uses date-fns for formatting and due-date calculation (src/utils/formatDate.js).
Accessibility vs UX: keyboard focus management is implemented (e.g. focus trap in src/components/DeleteModal.jsx), but a11y could be expanded with more announcements for screen readers.

Accessibility notes
Modal focus management & ESC handling:
Focus trap and initial focus in DeleteModal.
ESC closes the modal and invoice drawer in DeleteModal.jsx and InvoiceForm.jsx.
Proper semantics:
Dialogs use role="dialog" and aria-modal (InvoiceForm, DeleteModal).
Form inputs have associated labels; error messages use role="alert" (src/components/InvoiceForm.jsx).
Invoice list uses links with meaningful text and aria-label where appropriate (src/pages/InvoiceListPage.jsx).
