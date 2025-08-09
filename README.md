# TTravel Hospitality - Travel Booking Platform

A modern, full-stack travel booking platform specializing in domestic and international travel packages with comprehensive admin management capabilities.

## 🌟 Features

### Public Features
- **Responsive Design**: Beautiful, mobile-friendly interface
- **Package Browsing**: Browse domestic and international travel packages
- **Individual Buy Now Buttons**: Each package has its own configurable booking URL
- **Contact Forms**: Contact inquiry system with admin management
- **Newsletter Subscription**: Email subscription with active status tracking
- **Dynamic Content**: Configurable website content through admin panel

### Admin Panel Features
- **Content Management**: Edit website text, titles, and configuration
- **Destination Management**: Add, edit, delete travel destinations
- **Package Management**: Full CRUD operations for travel packages
- **Individual Package URLs**: Configure separate Google Form/booking URLs for each package
- **Contact Submissions**: Track and manage customer inquiries
- **Newsletter Management**: View and manage email subscriptions
- **Dashboard Analytics**: View basic statistics and metrics

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **Tailwind CSS** for styling
- **shadcn/ui** components with Radix UI primitives
- **Vite** for fast development and builds

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** with Neon serverless database
- **Drizzle ORM** for database operations
- **Session-based authentication**

### Development Tools
- **Hot Module Replacement** via Vite
- **ESLint** and **TypeScript** for code quality
- **PostCSS** with Tailwind CSS processing

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)

### Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret_key
NODE_ENV=development
```

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ttravel-hospitality
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5000
   - Admin Panel: http://localhost:5000/admin
   - Default admin credentials: `admin` / `admin123`

## 🚀 Deployment on Replit

### Quick Deploy
1. **Import to Replit**: Fork this project to your Replit account
2. **Set Environment Variables**: Add your database URL and session secret in Replit Secrets
3. **Deploy**: Click the "Deploy" button in your Replit project

### Environment Setup in Replit
Add these secrets in your Replit project:
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `SESSION_SECRET`: A secure random string for session encryption

### Database Setup
The application will automatically:
- Connect to your PostgreSQL database
- Initialize sample data for testing
- Create admin user with default credentials

## 📋 Usage Guide

### Admin Panel Access
1. Navigate to `/admin`
2. Login with credentials: `admin` / `admin123`
3. Access different management sections:
   - **Content**: Edit website text and settings
   - **Destinations**: Manage travel destinations
   - **Packages**: Create and edit travel packages with individual Buy Now URLs
   - **Contact**: View customer inquiries
   - **Newsletter**: Manage email subscriptions

### Package Management
- **Create Package**: Add new travel packages with custom Buy Now URLs
- **Edit Package**: Update package details including individual Google Form URLs
- **Featured Packages**: Mark packages as featured for homepage display
- **Buy Now URLs**: Each package can have its own Google Form or booking URL

### Content Management
- Edit homepage hero text
- Configure inquiry button text and URL
- Manage site-wide content and messaging

## 🏗️ Project Structure

```
ttravel-hospitality/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/         # Page components
│       ├── lib/           # Utilities and helpers
│       └── hooks/         # Custom React hooks
├── server/                # Express.js backend
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database interface
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts        # Database schema and types
└── package.json         # Dependencies and scripts
```

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/content` - Website content
- `GET /api/destinations/:type` - Get destinations by type
- `GET /api/packages/destination/:id` - Get packages by destination
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter

### Admin Endpoints (Authentication Required)
- `POST /api/auth/login` - Admin login
- `GET/PUT /api/admin/content` - Content management
- `GET/POST/PUT/DELETE /api/admin/destinations` - Destination management
- `GET/POST/PUT/DELETE /api/admin/packages` - Package management
- `GET /api/admin/contact-submissions` - Contact form submissions
- `GET /api/admin/stats` - Dashboard statistics

## 🎯 Key Features Implementation

### Individual Package Buy Now URLs
Each travel package now has its own configurable Buy Now URL that can point to:
- Individual Google Forms for package-specific inquiries
- External booking systems
- Custom landing pages

This allows for:
- Package-specific lead tracking
- Customized inquiry forms per package
- Better conversion tracking and analytics

### Admin Content Management
- Dynamic website content that can be edited without code changes
- Configurable hero section with custom inquiry buttons
- Flexible destination and package management

### Responsive Design
- Mobile-first design approach
- Optimized for all screen sizes
- Fast loading with optimized images

## 🔒 Security Notes

⚠️ **Important for Production:**
- Change default admin credentials immediately
- Use strong session secrets
- Implement password hashing (currently using plain text)
- Add input validation and sanitization
- Enable HTTPS in production
- Add rate limiting for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the admin panel for configuration options
2. Review the database connection settings
3. Ensure all environment variables are properly set
4. Contact support if deployment issues persist

---

**Built with ❤️ for TTravel Hospitality**