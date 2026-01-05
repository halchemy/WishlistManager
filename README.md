# WishlistManager

A web application to manage wishlists from various shopping sites in one place.

## Features

- **User Authentication**: Register and login with email/password
- **Item Management**: Add, edit, delete wishlist items
- **OGP Auto-fetch**: Automatically fetch product info from URL
- **Search & Filter**: Search items and filter by status

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router

### Backend
- Node.js + Express
- TypeScript
- better-sqlite3

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Clone the repository

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Initialize the database:
```bash
cd backend
npm run db:init
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server (in another terminal):
```bash
cd frontend
npm run dev
```

3. Open http://localhost:3000 in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### OGP
- `POST /api/ogp/fetch` - Fetch OGP data from URL

## Project Structure

```
WishlistManager/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Page components
│   │   ├── store/      # Zustand stores
│   │   ├── lib/        # Utilities and API client
│   │   └── types/      # TypeScript types
│   └── ...
├── backend/            # Node.js backend
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic
│   │   ├── middleware/ # Express middleware
│   │   ├── db/         # Database setup
│   │   └── types/      # TypeScript types
│   └── ...
└── docs/               # Documentation
    └── requirements.md # Requirements document
```

## License

MIT
