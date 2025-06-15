# GrindGears - Ecommerce Web App

A modern, responsive ecommerce web application built with React and TypeScript for selling gear and equipment.

## Features

- **Product Catalog** - Browse products with search, filtering, and sorting
- **Shopping Cart** - Add/remove items with quantity management
- **Wishlist** - Save products for later purchase
- **Category Navigation** - Organized product browsing by categories
- **Order Management** - Complete checkout and order tracking
- **Responsive Design** - Mobile-first approach with drawer navigation

## Tech Stack

- **Frontend**: React 19, TypeScript, React Router
- **UI Library**: Material-UI (MUI), Tailwind CSS, shadcn/ui
- **Build Tool**: Vite
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React, React Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd my-ecommerce-app
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React Context providers
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## API Integration

The app connects to a REST API backend with endpoints for:

- Products/Gears management
- Cart operations
- Wishlist management
- Order processing
- User addresses

## Deployment

Configured for Vercel deployment with SPA routing support.

## License

This project is licensed under the MIT License.
