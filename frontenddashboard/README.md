# Sales Dashboard

A React dashboard for viewing and uploading sales data, with data tables, filters, search, and charts. Built with **Vite**, **React**, **MUI**, **Redux Toolkit**, and **Recharts**.

---

## Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (or yarn / pnpm)
- **Backend API** running on `http://localhost:3000` (see [API](#api) section)

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend API

Ensure your backend is running on **port 3000** and exposes:

- `GET http://localhost:3000/api/getsales` — returns sales data
- `POST http://localhost:3000/api/upload` — accepts file upload with form key **`file`**

### 3. Run the frontend

```bash
npm run dev
```

Then open the URL shown in the terminal (e.g. `http://localhost:5173`).

### 4. Build for production

```bash
npm run build
```

Output is in the `dist/` folder. To preview the production build locally:

```bash
npm run preview
```

---

## API

The app talks to your backend via a Vite proxy: requests to `/api/*` are forwarded to `http://localhost:3000`.

| Method | Path        | Description                          |
|--------|-------------|--------------------------------------|
| GET    | `/api/getsales` | Fetch all sales data (array or `{ data: [] }`) |
| POST   | `/api/upload`   | Upload CSV/Excel; form field name must be **`file`** |

### Expected data shape (for charts and table)

Each sales record can use any of these field names (snake_case or camelCase):

- **Product:** `product_name`, `productName`, `Product Name`, `Product`
- **Category:** `category`, `Category`
- **Rating:** `rating`, `Rating`, `average_rating` (number, e.g. 0–5)
- **Reviews:** `review_count`, `reviewCount`, `reviews`, `Reviews`, `num_reviews` (number)
- **Discount:** `discount`, `Discount`, `discount_percentage`, `Discount Percentage` (number, e.g. 0–100)

If your API uses different names, update `src/utils/dataNormalizer.js`.

---

## Features

- **File upload** — CSV or Excel (.xlsx, .xls), max 10 MB; validation and loading/error/success messages
- **Data table** — Pagination (5 / 10 / 25 / 50), sort by columns
- **Filters** — Category dropdown; Review filter (All / Has reviews / No reviews)
- **Search** — By product name (client-side on loaded data)
- **Charts (Recharts)**  
  - Products per category (horizontal bar)  
  - Top reviewed products (bar)  
  - Discount distribution (histogram)  
  - Category-wise average rating (bar)
- **State** — Redux Toolkit + RTK Query for API calls and cache
- **UI** — MUI theme, loading states, and basic error handling

---

## Project structure

```
frontenddashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── charts/           # Recharts components
│   │   ├── ChartsSection.jsx
│   │   ├── FileUpload.jsx
│   │   └── SalesTable.jsx
│   ├── store/
│   │   ├── salesApi.js       # RTK Query (getSales, upload)
│   │   └── store.js
│   ├── utils/
│   │   └── dataNormalizer.js # Normalize API rows for UI
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js           # Proxy /api → localhost:3000
└── README.md
```

---

## Scripts

| Command         | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start dev server (Vite)     |
| `npm run build`| Production build → `dist/`  |
| `npm run preview` | Serve `dist/` locally   |
| `npm run lint` | Run ESLint                 |

---

## Troubleshooting

- **Charts/table empty or “Failed to load”**  
  Check that the backend is running on port 3000 and that `GET /api/getsales` returns valid JSON (array or `{ data: [...] }`).

- **Upload fails**  
  Confirm the upload endpoint expects the file in a field named **`file`** and that CORS allows requests from your dev origin (e.g. `http://localhost:5173`). The Vite proxy sends requests from the same origin, so CORS is usually not an issue in dev.

- **Wrong columns in table/charts**  
  Adjust `src/utils/dataNormalizer.js` to match your API field names.
