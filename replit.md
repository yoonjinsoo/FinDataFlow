# B2B Purchase Financing Landing Page

## Overview

This is a modern B2B purchase financing landing page built with React, TypeScript, and Express.js. The application targets established online sellers who need funding for inventory purchases. The platform positions itself as a "trusted growth financing partner" rather than a traditional loan company, emphasizing partnership and business growth.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Hook Form for form handling, TanStack Query for server state
- **Animations**: Framer Motion for smooth animations and interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple

### UI/UX Design System
- **Component Library**: shadcn/ui (Radix UI primitives with Tailwind styling)
- **Design Style**: "new-york" variant with neutral base colors
- **Theme**: Professional FinTech aesthetic with dark mode support
- **Icons**: Lucide React for consistent iconography

## Key Components

### Landing Page Structure
1. **Hero Section**: Main value proposition with CTA
2. **Pain Points**: Checklist of common business challenges
3. **Solution Overview**: 4-step process visualization
4. **Partnership Qualification**: Interactive assessment form
5. **Contact Form**: Lead capture with company details

### Form Management
- React Hook Form integration for validation and state management
- Zod schema validation through drizzle-zod
- Progressive disclosure for qualification questions
- Real-time form validation with user feedback

### Database Schema
- User management system with PostgreSQL backend
- UUID-based primary keys for scalability
- Prepared for expansion with additional business entities

## Data Flow

### Client-Side Flow
1. User lands on homepage with animated sections
2. Smooth scrolling navigation between sections
3. Interactive qualification assessment
4. Form submission triggers email via mailto (MVP approach)
5. TanStack Query manages API communication state

### Server-Side Flow
1. Express.js serves static assets in production
2. API routes prefixed with `/api` for clear separation
3. Drizzle ORM handles database operations
4. Session management for user state persistence
5. Error handling middleware for graceful failures

## External Dependencies

### Core Dependencies
- **UI Framework**: React ecosystem with TypeScript support
- **Database**: Neon Database (serverless PostgreSQL)
- **Email**: mailto: links for MVP (no backend email service required)
- **CDN/Hosting**: Configured for Replit deployment

### Development Tools
- **Code Quality**: TypeScript for type safety
- **Build Pipeline**: Vite with esbuild for production builds
- **Development**: tsx for TypeScript execution in development
- **Database Management**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development Environment
- Vite development server with HMR (Hot Module Replacement)
- Express.js backend serving API routes
- Replit-specific plugins for enhanced development experience
- TypeScript compilation with strict mode enabled

### Production Build
1. Frontend: Vite builds optimized React application
2. Backend: esbuild bundles Node.js server code
3. Static assets served from Express.js
4. Environment variables for database connection
5. Single-command deployment ready

### Database Strategy
- PostgreSQL migrations managed by Drizzle Kit
- Environment-based configuration
- Connection pooling through Neon's serverless architecture
- Schema versioning for safe updates

### MVP Considerations
- mailto: functionality eliminates need for email service integration
- Simple lead capture focuses on core value proposition
- Scalable architecture allows for future feature additions
- Performance optimized for fast loading and user engagement