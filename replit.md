# Storyly V2 Dashboard

## Overview

This is a modern web application for managing Storyly widgets, recipes, and placements. It's built as a full-stack application using React for the frontend and Express.js for the backend, with PostgreSQL as the database. The application provides a comprehensive dashboard for creating and managing interactive content widgets for e-commerce and marketing campaigns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query (TanStack Query) for server state
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: PostgreSQL session store (connect-pg-simple)
- **API Pattern**: RESTful API with JSON responses

### Project Structure
The application follows a monorepo structure with three main directories:
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and database schemas

## Key Components

### Database Schema
The application uses Drizzle ORM with PostgreSQL and includes the following main entities:
- **Users**: Authentication and user management
- **Widgets**: Individual content pieces (banners, story bars, video feeds, carousels)
- **Recipes**: AI-powered campaign workflows with predefined templates
- **Placements**: UI entry points where widgets are displayed
- **Audience Segments**: User targeting and segmentation
- **Analytics**: Performance tracking and metrics

### Frontend Components
- **Dashboard Layout**: Sidebar navigation with main content area
- **Widget Creator**: Multi-step form for creating and configuring widgets
- **Recipe Creator**: Visual workflow builder for campaign automation
- **Widget Preview**: Real-time preview with mobile/desktop toggle
- **Analytics Dashboard**: Performance metrics and reporting

### API Endpoints
The backend provides RESTful endpoints for:
- `/api/widgets` - CRUD operations for widgets
- `/api/recipes` - CRUD operations for recipes
- `/api/placements` - CRUD operations for placements
- `/api/audience-segments` - CRUD operations for audience segments
- `/api/analytics` - Performance data and metrics

## Data Flow

1. **User Authentication**: Users authenticate through the system (schema exists but auth flow not fully implemented)
2. **Widget Creation**: Users create widgets through a multi-step form with real-time preview
3. **Recipe Building**: Users build automated campaigns using a visual workflow editor
4. **Placement Management**: Users define where widgets appear in their applications
5. **Analytics Tracking**: Performance data is collected and displayed in the dashboard

## External Dependencies

### Frontend Dependencies
- **UI Framework**: Radix UI primitives for accessible components
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Native fetch API wrapped in React Query
- **Icons**: Lucide React icons
- **Date Handling**: date-fns library
- **Carousel**: Embla Carousel for widget previews

### Backend Dependencies
- **Database**: Neon Database (PostgreSQL-compatible)
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Store**: PostgreSQL session storage
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build**: Vite for frontend bundling, esbuild for backend
- **TypeScript**: Full TypeScript support across the stack
- **Code Quality**: ESLint and Prettier configurations
- **Replit Integration**: Cartographer plugin for development environment

## Deployment Strategy

The application is configured for deployment on Replit with:
- **Development**: `npm run dev` starts both frontend and backend in development mode
- **Production Build**: `npm run build` creates optimized bundles for both client and server
- **Production**: `npm start` serves the built application
- **Database**: Uses Neon Database with connection via DATABASE_URL environment variable

### Build Process
1. Frontend builds to `dist/public/` directory
2. Backend builds to `dist/` directory as ESM bundle
3. Static assets are served by Express in production
4. Database migrations are handled via Drizzle Kit

The application is designed to be scalable and maintainable, with clear separation of concerns between frontend and backend, comprehensive type safety, and a modern development experience.

## Recent Changes: Latest modifications with dates

### July 17, 2025 - Analytics Page Redesign & User Experience Improvements
- **Analytics Page**: Completely redesigned with widget type filtering, performance metrics, interactive charts, and story groups matching provided design system
- **Sidebar Navigation**: Fixed "ChartScatter" display name to "Analytics" 
- **Overview Page**: Removed "Create New" button, added AI chatbot for user assistance with widgets, recipes, and analytics
- **Audience Page**: Redesigned to exactly match provided screenshot with sortable table, search functionality, and proper layout
- **Recipe Page**: Enhanced with categorized templates including descriptions and recipe counts for better organization
- **Bug Fixes**: Resolved SelectItem empty value error in placements page
- **AI Chatbot**: Interactive assistant providing contextual help about performance metrics, widget creation, and recipe optimization

### July 17, 2025 - Recipe Creator & Widget Enhancements
- **Recipe Creator**: Fixed navigation bug in placement assignment step, now properly advances to preview & launch
- **Smart Sorting**: Replaced "Delivery Conditions" with "Smart Sorting" and added AI icons for better clarity
- **AI Icons**: Added Bot icons next to AI Content Personalization and Smart Sorting titles
- **Recipe Categories**: Made recipe cards smaller (4 columns on desktop) to reduce horizontal scrolling
- **New Widget Types**: Added 5 new widget types to match design requirements:
  - Swipe Card: Interactive swipe cards with engaging animations
  - Canvas: Custom canvas widgets with interactive elements
  - Carousel: Multi-item carousel for product showcases
  - Countdown: Urgency-driven countdown timers
  - Quiz: Interactive quiz widgets for user engagement
- **Widget Platform Badges**: Added platform-specific badges (Mobile/Desktop) for each widget type