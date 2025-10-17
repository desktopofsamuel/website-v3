# Desktop of Samuel - Website Documentation

## Overview

**Desktop of Samuel** is a personal portfolio and blog website for Samuel Wong, a Hong Kong-based UI/UX designer. This is the third iteration of the website, built with Next.js and modern web technologies. The site serves as both a professional portfolio showcasing design work and a personal blog covering design, technology, and productivity topics.

**Live Site**: [desktopofsamuel.com](https://desktopofsamuel.com)

## Website Functionality

### Core Features

1. **Multi-Content Type Blog System**
   - **Blog Posts**: Design, technology, and productivity articles
   - **Portfolio/Work**: Showcase of professional design projects
   - **Photo Gallery**: Travel photography organized by cities visited

2. **Dynamic Content Integration**
   - **Spotify Integration**: Real-time music data (currently playing, top tracks, top artists)
   - **Reading List**: RSS feed integration for books via Oku
   - **Film Reviews**: Letterboxd RSS feed integration
   - **External APIs**: Airtable integration for dynamic content

3. **Interactive Elements**
   - **Scroll-based Photo Gallery**: Parallax-style photo scrolling on homepage
   - **Dark/Light Mode**: Theme switching with system preference detection
   - **Responsive Design**: Mobile-first approach with adaptive layouts
   - **Smooth Animations**: Framer Motion and React Reveal for page transitions

4. **Content Management**
   - **MDX Support**: Rich content with React components in markdown
   - **Tag System**: Categorized content with filtering
   - **SEO Optimization**: Comprehensive meta tags and structured data
   - **RSS Feeds**: Automated feed generation

### Page Structure

- **Homepage**: Featured content, live data cards, photo gallery
- **Blog**: Article listings with pagination and tag filtering
- **Work/Portfolio**: Project showcases with detailed case studies
- **Photo**: Travel photography organized by location
- **About**: Personal information and background
- **Resources**: Tools and setup recommendations
- **Uses**: Current tools and gadgets

## Technical Implementation

### Technology Stack

**Frontend Framework**
- **Next.js 13**: React framework with App Router
- **TypeScript**: Type-safe development
- **Chakra UI**: Component library with custom theme
- **Framer Motion**: Animation library

**Content Management**
- **Contentlayer**: Type-safe content management
- **MDX**: Markdown with React components
- **Gray Matter**: Front matter parsing

**Styling & Design**
- **Custom Theme**: OKLCH color space implementation
- **Fonts**: Space Grotesk (headings), Chivo (body)
- **Responsive Design**: Mobile-first approach

**External Integrations**
- **Spotify Web API**: Music data integration
- **Airtable**: Dynamic content management
- **RSS Parsers**: Book and film data
- **Google Analytics**: Analytics tracking

### Architecture

#### Content Layer Structure

```typescript
// Three main content types defined in contentlayer.config.js
- Post: Blog articles with categories, tags, reading time
- Work: Portfolio projects with metadata, images, case studies  
- Photo: Travel photography with location data
```

#### API Routes

```javascript
// Dynamic data endpoints
/api/currently-playing.js    // Spotify real-time data
/api/top-tracks.js          // Spotify top tracks
/api/top-artists.js         // Spotify top artists
/api/books.js              // RSS feed from Oku
/api/films.js              // RSS feed from Letterboxd
/api/uses-apps.js          // Airtable data
/api/uses-gadgets.js       // Airtable data
/api/resources-career.js    // Career resources
```

#### Component Architecture

```typescript
// Core layout components
Layout.tsx          // Main layout wrapper
NavBar.tsx          // Navigation with theme toggle
Footer.tsx          // Site footer

// Content display components  
ListBlog.tsx        // Blog post listings
ListPortfolio.tsx   // Work project listings
ListFeed.tsx        // RSS feed display

// Interactive cards
CardBook.tsx        // Reading list display
CardMusic.tsx       // Spotify data display
CardCurrentlyPlaying.tsx // Real-time music
CardFilms.tsx       // Film reviews display
```

### Key Technical Features

#### 1. Content Management System
- **Type-safe content**: Contentlayer generates TypeScript types from MDX files
- **Rich markdown processing**: Rehype plugins for syntax highlighting, auto-linking, TOC
- **Front matter validation**: Structured metadata with required/optional fields
- **Computed fields**: Automatic slug generation, reading time calculation

#### 2. Performance Optimizations
- **Static generation**: Pre-built pages for fast loading
- **Image optimization**: Next.js Image component with responsive sizing
- **Code splitting**: Automatic bundle optimization
- **SEO optimization**: Comprehensive meta tags and structured data

#### 3. Interactive Features
- **Scroll-based animations**: Custom scroll handlers for photo gallery
- **Theme persistence**: Local storage for user preferences
- **Responsive navigation**: Mobile hamburger menu with modal
- **Smooth transitions**: Page transitions and hover effects

#### 4. External Data Integration
- **Spotify API**: OAuth flow with refresh tokens
- **RSS parsing**: Real-time content from external services
- **Airtable integration**: Dynamic content management
- **Error handling**: Graceful fallbacks for API failures

### Development Setup

#### Prerequisites
- Node.js 18+
- pnpm (preferred package manager)
- Environment variables for external APIs

#### Environment Variables
```bash
# Spotify API
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

# Airtable
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=

# Analytics
NEXT_PUBLIC_MEASUREMENT_ID=

# RSS Proxies
RSS_PROXY_URL=
```

#### Development Commands
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Deployment

- **Platform**: Vercel (recommended)
- **Build Process**: Automatic from Git repository
- **Environment**: Production environment variables
- **Analytics**: Vercel Analytics integration
- **CDN**: Global edge network for fast loading

### Content Workflow

1. **Content Creation**: Write MDX files in `/content/` directories
2. **Metadata**: Add front matter with required fields
3. **Images**: Place in `/public/static/` directory
4. **Build**: Contentlayer processes and generates types
5. **Deploy**: Automatic deployment via Vercel

### Customization

#### Theme System
- **OKLCH Colors**: Modern color space for better accessibility
- **Typography**: Custom font stack with fallbacks
- **Components**: Reusable Chakra UI components with custom variants
- **Dark Mode**: System preference detection with manual toggle

#### Content Types
- **Blog Posts**: Design journal and setup articles
- **Work Projects**: Detailed case studies with images
- **Photo Collections**: Travel photography with location data

## Future Enhancements

### Technical Improvements
- [ ] Migration to Next.js 15 App Router
- [ ] Migration to Chakra UI v3
- [ ] Enhanced image optimization
- [ ] Advanced caching strategies
- [ ] PWA capabilities
- [ ] Enhanced SEO features

## Migration Rules & Guidelines

### Next.js v15 Migration Rules
1. **Data Fetching**: Use native `fetch()` with caching instead of `getStaticProps`
2. **Dynamic Routes**: Use `generateStaticParams` instead of `getStaticPaths`
3. **API Routes**: Can keep in `/pages/api` or migrate to Route Handlers
4. **Images**: Use Next.js Image component with proper optimization
5. **Metadata**: Use `generateMetadata` function for dynamic metadata

### Chakra UI v3 Migration Rules
1. **Provider Setup**: Use `@chakra-ui/next-js` for App Router compatibility
2. **Theme**: Update theme configuration for v3 syntax
3. **Components**: Use new component APIs and props
4. **Styling**: Use new styling patterns and responsive design
5. **Client Components**: Add `"use client"` for interactive components

### App Router Migration Rules
1. **Server Components**: Default to Server Components, use Client Components only when needed
2. **Layouts**: Use nested layouts for shared UI
3. **Loading States**: Implement loading.tsx for better UX
4. **Error Boundaries**: Add error.tsx for error handling
5. **Metadata**: Use generateMetadata for dynamic SEO

### Content Management Migration Rules
1. **Contentlayer**: Ensure compatibility with App Router patterns
2. **MDX**: Update processing for new rendering patterns
3. **Static Generation**: Use proper caching and revalidation strategies
4. **Dynamic Content**: Implement proper loading states for dynamic data

## License

- **Content**: All rights reserved for personal content
- **Code**: MIT License
- **Assets**: Copyright protected images and graphics

---

*This documentation provides a comprehensive overview of the Desktop of Samuel website's functionality and technical implementation. The site represents a modern, performant personal portfolio that effectively showcases both professional work and personal interests through thoughtful design and technical architecture.* 