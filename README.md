# Threadz BigAskins - Fashion & Clothing E-Commerce Store

A modern, fully-functional e-commerce application built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite 7, Tailwind CSS 3
- **Routing**: React Router DOM for seamless navigation
- **UI Components**: Beautiful UI components from shadcn/ui with Radix UI primitives
- **State Management**: Context API for cart and theme management
- **Responsive Design**: Mobile-first responsive design with dark/light theme support
- **E-Commerce Features**:
  - Product catalog with filtering and search
  - Product details with image gallery
  - Shopping cart with quantity management
  - Checkout process
  - User authentication (Login/Register)
  - User profile management

## 📦 Project Structure

```
threadz-bigaskins/
├── src/
│   ├── component/          # React components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   └── ui/            # Reusable UI components (shadcn/ui)
│   ├── context/           # React Context providers
│   ├── data/              # Mock data and types
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles with Tailwind directives
├── public/                # Static assets
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.ts         # Vite configuration with path aliases
└── tsconfig.app.json      # TypeScript configuration

```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm

### Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173/`

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 🎨 Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 3.4.13
- **UI Components**: Radix UI primitives
- **Routing**: React Router DOM 7.10.0
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Theme**: next-themes for dark/light mode

## 📱 Available Routes

- `/` - Home/Landing page
- `/products` - Products catalog
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/login` - User login
- `/register` - User registration
- `/profile` - User profile

## 🎯 Key Features Implemented

### 1. **Tailwind CSS Configuration**
   - Fully configured with custom theme colors
   - Dark mode support
   - Custom animations
   - Responsive utilities

### 2. **Path Aliases**
   - `@/` alias configured for cleaner imports
   - Resolves to `./src` directory

### 3. **Component Library**
   - 40+ reusable UI components from shadcn/ui
   - Fully typed with TypeScript
   - Accessible with Radix UI primitives

### 4. **State Management**
   - Cart context for managing shopping cart
   - Theme context for dark/light mode
   - Toast notifications

### 5. **Product Data**
   - Mock product data with images from Unsplash
   - Product categories
   - Reviews and ratings

## 🚀 Development

### Running the App

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📝 Notes

- All components use proper TypeScript typing
- Import paths use `@/` alias for cleaner code
- Theme persists in localStorage
- Cart state is maintained in memory (can be enhanced with localStorage)

## 🤝 Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## 📄 License

This project is open source and available under the MIT License.
