# Commerce API

The Commerce API is a robust and scalable API designed to power e-commerce platforms. It offers a comprehensive set of features for product management, user authentication, order handling, and more.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

### 1. Product Management
- Create, read, update, and delete products.
- Manage product attributes like pricing, inventory, and categories.
- Support for product images and descriptions.

### 2. User Authentication
- Secure user login and registration with JWT.
- Password hashing for added security.
- Password reset functionality.

### 3. Order Management
- Order creation and tracking.
- Manage order statuses (pending, shipped, delivered, etc.).
- Order history for users.

### 4. Payment Integration
- Integration with Stripe and PayPal.
- Secure payment processing with real-time transaction updates.
- Customizable payment options.

### 5. Category Management
- Create, update, and delete categories.
- Assign products to categories for better organization.

### 6. Role-Based Access Control (RBAC)
- Define roles and permissions.
- Secure sensitive endpoints based on user roles.
- Admin panel access control.

### 7. Comprehensive API Documentation
- Detailed API documentation with examples.
- Interactive API testing with tools like Postman.

## Installation

### Prerequisites
- Node.js v14.x or higher
- MongoDB
- Git

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alihgad/Commerce-API.git
   ```
2. ** Navigate to the project directory**:
   ```bash
   cd Commerce-API
   ```
3. **install dependencies** :
   ```bash
   npm install
   ```
  4. **Set up environment variables**:
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```bash
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret_key
     STRIPE_SECRET_KEY=your_stripe_secret_key
     PAYPAL_CLIENT_ID=your_paypal_client_id
     PAYPAL_SECRET=your_paypal_secret
     ```

5. **Start the server**:
   ```bash
   npm start
  ```
## Usage

postman docs : https://documenter.getpostman.com/view/32065315/2sA3s4mWHm 
 
