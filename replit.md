# TTravel Hospitality

## Overview

TTravel Hospitality is a full-stack travel booking platform specializing in domestic and international travel packages. The application allows users to browse destinations, submit contact inquiries, subscribe to newsletters, and includes a comprehensive admin panel for content and destination management. Built with modern web technologies, it provides a responsive user interface with server-side data management and real-time content updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

### Complete About Page Editability (January 2025)
- **COMPLETED**: Made entire About page content editable from admin panel
- Added dedicated "About Page" section in admin dashboard with user-friendly interface
- All sections now editable: Hero titles, Who We Are content, Mission, Vision, Values
- Added content management for section image URL in Who We Are section
- Connected About page to dynamically display admin-managed content from database
- Enhanced admin experience with organized form sections and clear labeling

### Admin Panel and Mobile Navigation Improvements (January 2025)
- **COMPLETED**: Fixed contact form submissions to be clickable with detailed modal views
- Added comprehensive submission detail modal with full message display
- Implemented direct reply via email and call functionality from admin panel
- Added "Mark as Responded" button to close tickets in contact submission modals
- **COMPLETED**: Fixed mobile navigation menu functionality
- Mobile hamburger menu now properly toggles and displays all navigation links
- Added smooth transitions and proper styling for mobile menu
- Users can now access Domestic and International pages on mobile devices
- **COMPLETED**: Implemented pagination for destination and package management (10 items per page)
- Added page navigation controls showing all items across multiple pages (1, 2, 3...)
- **COMPLETED**: Fixed search text visibility in domestic and international pages
- Search input text is now black instead of white for better readability
- **COMPLETED**: Added Settings section with admin password change functionality
- Admin can now change password directly from the admin panel with validation
- Includes current password verification and new password confirmation

### Enhanced Gallery with Local File Upload (January 2025)
- **COMPLETED**: Major gallery enhancement with local file upload capabilities
- Added dual upload modes: local file upload with Base64 conversion + traditional URL upload
- Implemented image preview, file validation (5MB limit), and progress indicators
- Enhanced admin gallery management with improved approve/delete controls
- Added gallery statistics dashboard showing total, approved, and pending images
- Optimized for performance with Base64 storage to prevent site slowdowns
- Users can now upload images directly from their device with drag-and-drop interface

### Individual Package Buy Now URLs Implementation (January 2025)
- **COMPLETED**: Enhanced package system with individual Buy Now URLs for each package
- Added `buyNowUrl` field to packages database schema and admin management
- Each package now has its own configurable Google Form or booking URL
- Admin panel includes Buy Now URL fields in both package creation and editing forms
- Updated PackagesSection component to use individual package URLs instead of global inquiry URL
- Sample packages initialized with placeholder Buy Now URLs for testing
- Successfully tested: package creation, editing, and Buy Now button functionality

### Previous Features
- Added configurable inquiry button functionality to home page hero section
- Button text and URL can be managed from admin panel Content Management section
- Replaced generic "Enquire Now" with "Buy Now" buttons styled in green
- Centralized content management through admin panel

### Migration to Replit Environment (January 2025)
- **COMPLETED**: Successfully migrated project from Replit agent to native Replit environment
- Fixed all package dependencies and workflow configurations
- Enhanced security practices with proper client/server separation
- Verified all features working: authentication, gallery, admin panel, form submissions
- Applied robust security measures and performance optimizations

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component system for consistent, accessible interface
- **Styling**: Tailwind CSS with custom CSS variables for theme management and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript for both client and server code
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful API endpoints with structured error handling
- **Development**: Hot module replacement via Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless database hosting
- **ORM**: Drizzle ORM for type-safe database queries and schema management
- **Schema**: Structured tables for users, destinations, content, contact submissions, and newsletter subscriptions
- **Migrations**: Database schema versioning through Drizzle Kit
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios

### Authentication and Authorization
- **Admin Authentication**: Session-based authentication for admin panel access
- **Password Storage**: Plain text storage (should be upgraded to hashed passwords for production)
- **Session Persistence**: PostgreSQL-backed session storage using connect-pg-simple
- **Route Protection**: Middleware-based authentication checks for admin routes

### Content Management System
- **Dynamic Content**: Key-value content storage for editable website text and configuration
- **Admin Controls**: Full CRUD operations for destinations, content management, and contact submission tracking
- **File Uploads**: Support for destination images and media management
- **Newsletter Management**: Subscription handling with active status tracking

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database interactions and schema management

### UI and Design
- **Radix UI**: Headless UI primitives for accessibility and component behavior
- **shadcn/ui**: Pre-built component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Google Fonts**: Poppins and Montserrat font families for typography
- **Bootstrap Icons**: Icon library for UI elements and visual indicators

### Development and Build Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Type checking and enhanced developer experience
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Form and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for API requests and form data
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

### External Integrations
- **Unsplash**: Stock photography service for placeholder destination images
- **Google Forms**: External form handling for travel inquiries and bookings
- **Replit**: Development environment integration with runtime error handling