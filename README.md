# JARA E-commerce Platform
This is a full-stack e-commerce web application built with the MERN stack as a practice project.  
The project consists of two repositories:  
- **Frontend** – This repository  
- **Backend** – [View Backend Repository](https://github.com/jeannjang/ecommerce-be)
  
## Frontend Overview
This includes ``user and admin`` features, with ``JWT and Google OAuth`` authentication.  
It also utilizes ``Redux`` and supports ``automated deployment``.

## Features
### User Features
- **User Authentication**: Email/password login and Google OAuth integration
- **Product Browsing**: View products with details, filtering by category
- **Search products**: Search products by name
- **Shopping Cart**: Add, remove products and update quantity
- **Checkout & Payment**: Order creation with shipping details
- **Order History**: Track order status and view past orders
- **Reviews**: Leave reviews on their purchases 
### Admin Features
- **Admin Dashboard**: Overview of products and orders
- **Product Management**: Create, edit, delete products, manage stock levels
- **Order Management**: Process orders and update order status

## Tech Stack
- **React, Redux Toolkit, React Router** (Frontend library, State management, Routing)
- **Bootstrap** (UI framework)
- **Axios** (Handle API requests)
- **Google OAuth** (Social authentication)
- **Cloudinary** (Image hosting)

## How to start
### Requirement
- Node.js (v > v14)
- npm or yarn
- Backend API running
### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```  
4. Create .env file with:
   ```
   REACT_APP_LOCAL_BACKEND=http://localhost:5010/api  
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name  
   REACT_APP_CLOUDINARY_PRESET=your_cloudinary_preset  
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id  
4. Start the dev server:
   ```
   npm start
   ```
  - The app runs on http://localhost:4010

## Deployment
The frontend application is automatically deployed using ``Cloudflare Pages'`` deployment pipeline.  
When changes are pushed to the main branch, Cloudflare automatically detects the changes in the Github repository,  
builds the app according to the configured build settings and deploys the updated site to Cloudflare's global network.
