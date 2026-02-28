# Shavoraplace - Luxury Perfume E-Commerce

A premium luxury perfume e-commerce platform with stunning animations, glassmorphism effects, and a sophisticated black & gold aesthetic.

## Features

- **Luxury Design**: Premium black & gold theme with glassmorphism effects
- **Smooth Animations**: Framer Motion powered animations throughout
- **Responsive Layout**: Mobile-first design approach
- **Admin Panel**: Full product and order management
- **Secure Authentication**: JWT-based admin authentication
- **Real-time Updates**: Live inventory and order tracking
- **Cash on Delivery**: Simple payment processing

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **Image Storage**: Cloudinary

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shavoraplace
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
Create a `.env` file in the backend directory with the following:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development servers:
```bash
npm run dev
```

## Default Admin Credentials

- **Username**: `shovra01`
- **Password**: `shovraplace1`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get a single order (admin only)
- `POST /api/orders` - Create a new order (public)
- `PUT /api/orders/:id` - Update an order (admin only)
- `DELETE /api/orders/:id` - Delete an order (admin only)

## Project Structure

```
shavoraplace/
├── frontend/
│   ├── pages/
│   │   ├── index.js          # Product listing page (main landing)
│   │   ├── checkout.js       # Checkout page
│   │   ├── admin/
│   │   │   ├── login.js      # Admin login
│   │   │   └── dashboard.js  # Admin dashboard
│   │   └── _app.js           # Global styles and layout
│   ├── components/
│   │   ├── ProductCard.js    # Animated product cards
│   │   ├── CheckoutForm.js   # Elegant checkout form
│   │   ├── AdminSidebar.js   # Animated sidebar
│   │   └── LoadingSpinner.js # Premium loading spinner
│   └── styles/
│       └── globals.css       # Tailwind and custom styles
├── backend/
│   ├── server.js             # Express server
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── products.js       # Product CRUD operations
│   │   └── orders.js         # Order management
│   ├── models/
│   │   ├── User.js           # Admin user model
│   │   ├── Product.js        # Product model
│   │   └── Order.js          # Order model
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   └── config/
│       └── db.js             # Database connection
```

## Color Palette

- **Primary**: Deep Black (#0F0F0F)
- **Secondary**: Luxury Gold (#D4AF37)
- **Accent**: Soft Beige (#F5F1E8)

## License

MIT