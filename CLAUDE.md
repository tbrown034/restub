# Claude Development Preferences

This file contains preferences and guidelines for Claude when working on the Restub project.

## ABSOLUTE RULES - VIOLATING THESE = IMMEDIATE FAILURE

### THE GOLDEN RULE: NEVER DELETE EXISTING CODE
**This is non-negotiable. User spent 20+ hours on features like ticket cards.**
- READ the existing code completely before ANY modification
- PRESERVE every single existing feature, animation, and design element
- ONLY modify the specific parts requested - nothing more
- Ticket cards with perforated edges = DO NOT TOUCH unless specifically asked
- Custom UI elements = DO NOT REPLACE with generic components
- When in doubt = KEEP THE EXISTING CODE

### MANDATORY CHECKLIST BEFORE ANY CHANGE:
1. Read the entire file first
2. Identify what to preserve (99% of it)
3. Make ONLY the requested change
4. Verify nothing was deleted
5. Test at 100% zoom
6. Confirm all original features still work

### INSTANT FAILURE CONDITIONS:
- Deleting ticket cards or any custom UI
- Replacing detailed components with simplified versions
- Removing features that were working
- Making changes beyond what was asked
- Not testing before claiming completion
- Committing without explicit permission

### QUALITY STANDARDS:
- Professional-grade code only - this costs money
- Accurate, precise modifications - no sloppy work
- Preserve ALL existing functionality
- Test everything properly
- Respect the hours of work already done

## Important API Notes

### OpenAI GPT-5-mini
- **GPT-5-mini EXISTS**: This is a real, recently released OpenAI model (released after Claude's knowledge cutoff)
- The model ID `gpt-5-mini` is CORRECT and should be used as-is
- Uses the `openai.responses.create()` API format with web_search tools
- DO NOT change this to gpt-4 or gpt-3.5 - the user's code is correct

## Development Commands

- **Dev Server**: `npm run dev` (uses Turbopack for faster builds)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type Check**: `npm run lint` (includes TypeScript checking)

## Project Guidelines

### Modern React/Next.js Patterns (React 19 + Next.js 15+)

- **Always use latest React/Next.js documentation** for patterns and best practices
- **Server Actions**: Use server actions for form handling instead of client-side state
- **Server vs Client Components**: Default to server components, only use 'use client' when necessary
- **State Management**: Avoid useState/useEffect when server components can handle the logic
- **Progressive Enhancement**: Forms should work without JavaScript using server actions
- **Performance**: Optimize by keeping as much logic on the server as possible

### Code Style

- Use TypeScript for all new files
- Follow existing component patterns in `app/components/`
- Use Tailwind CSS for styling with bright, modern design system
- Maintain consistent gradient themes (vibrant colors, not dark/dreary)
- Use semantic HTML and accessible markup
- **ALWAYS use unique keys**: For React lists, always use `crypto.randomUUID()` or combine timestamp + UUID for guaranteed uniqueness. Never rely on Math.random() alone or simple incrementing.
- **NO EMOJIS IN CODE**: Never use emojis in the codebase. Use SVG icons from the Icon component instead. This includes UI text, buttons, messages, and any user-facing content.

### Component Structure

- Place reusable components in `app/components/`
- Use descriptive component names with PascalCase
- Include proper TypeScript interfaces for props
- Follow the existing pattern of Header/Footer layout wrapping

### State Management

- Use React useState for local component state
- Consider the existing form handling patterns
- Maintain data structures consistent with the Experience interface

### Styling Conventions

- Use existing Tailwind utility classes
- Maintain the gradient color scheme: purple-600 to blue-600
- Keep responsive design patterns (sm:, md:, lg: breakpoints)
- Use rounded-2xl for consistent border radius
- Apply hover effects and transitions for interactive elements

### Form Handling

- Use Next.js form actions pattern as established in catalog page
- Include proper validation and required field handling
- Maintain consistent input styling and focus states

## Testing & Quality

- Always run `npm run lint` after making changes
- Ensure responsive design works across breakpoints
- Test form functionality thoroughly
- Verify TypeScript compilation with no errors

## File Organization

- Keep components organized by feature
- Use descriptive file names
- Maintain the existing app directory structure
- Add new pages following the established routing patterns

## Future Development Notes

- Planning to add database integration
- Automatic experience detection feature in development
- Photo attachments will be added later
- Export functionality is planned

## Progress

This section tracks major problems tackled and solutions implemented during development.

### 2025-01-XX - Mobile Button Responsiveness Fix
**Problem**: Button groups were extending off-screen on mobile devices, creating poor UX
**Solution**: Updated all button containers from `flex gap-x` to `flex flex-col sm:flex-row gap-x` pattern
**Files Changed**: 
- `app/catalog/AddExperienceForm.tsx` (3 button groups)
- `app/catalog/ExperienceCard.tsx` (media upload buttons)  
- `app/profile/page.tsx` (2 button groups)
**Result**: All buttons now stack vertically on mobile and display horizontally on larger screens

### 2025-01-XX - Git Merge Conflict Resolution
**Problem**: Build failing due to unresolved merge conflicts in catalog page
**Solution**: Cleaned up merge conflict markers and duplicate code sections
**Files Changed**: `app/catalog/page.tsx`
**Result**: Build restored, parsing errors eliminated

### 2025-01-XX - ESLint & TypeScript Errors Fixed
**Problem**: Multiple lint warnings and TypeScript errors preventing clean builds
**Solution**: 
- Fixed unescaped apostrophes using `&apos;` HTML entities
- Removed unused variables and functions
- Added proper TypeScript type assertions for DOM manipulation
**Files Changed**: 
- `app/login/page.tsx`, `app/catalog/AddExperienceForm.tsx`, `app/track/page.tsx` (apostrophes)
- `app/profile/page.tsx` (unused variables, dead code removal)
- `app/catalog/AddExperienceForm.tsx` (TypeScript DOM types)
**Result**: Clean lint output, successful TypeScript compilation

### 2025-01-XX - Dark/Light Mode Implementation
**Problem**: No dark mode support, user requested readable dark theme with proper toggle
**Solution**: Implemented complete theme system using React Context + Tailwind CSS v4
**Components Added**:
- `tailwind.config.ts` - Dark mode configuration
- `app/components/ThemeProvider.tsx` - React context for theme management
- `app/components/ThemeToggle.tsx` - Toggle component with 3 modes (light/dark/system)
**Files Updated**:
- `app/layout.tsx` - Added ThemeProvider wrapper and dark mode background classes
- `app/components/Header.tsx` - Added theme toggle and dark mode styling
- `app/components/Hero.tsx` - Dark mode text colors
**Features**:
- 3-mode toggle: Light → Dark → System (follows OS preference)
- Persistent localStorage storage
- Smooth transitions and hover effects
- Mobile and desktop responsive
- Zero hydration issues
**Result**: Full dark/light mode support with beautiful, readable contrast and brand consistency

## Development Log

### 2025-01-04 - Fixed Game Tracking System (localStorage MVP)
**Context**: User reported issues with form submission, API requests, and game retrieval not working properly
**Problems Identified**:
1. Server actions (`getExperiences`) returning empty arrays instead of reading from storage
2. Assist page was a server component trying to call server actions that don't persist data
3. Date handling in `buildSearchQuery` not extracting form inputs correctly
4. Mismatch between client-side localStorage saves and server-side expectations

**Solutions Implemented**:
1. Converted assist page to client component to access localStorage directly
2. Updated `getExperiences` to read from localStorage on client side
3. Fixed date extraction logic to handle exactDate, month/year, yearOnly inputs
4. Added event-driven updates using custom events ('restub-game-added')
5. Synchronized storage keys between assist and profile pages
6. Fixed ExperienceCard deletion to work with localStorage

**Key Learnings**:
- GPT-5-mini is a real, recent OpenAI model (added to documentation)
- Server actions should handle persistence, but localStorage works for MVP
- Client/server component separation is crucial in Next.js 15

**Files Modified**:
- `app/assist/page.tsx` - Converted to client component
- `app/assist/AddExperienceForm.tsx` - Added event dispatching
- `app/assist/ExperienceCard.tsx` - Fixed deletion logic
- `app/assist/actions.ts` - Fixed date query building
- `CLAUDE.md` - Added GPT-5-mini documentation

## Next Steps (Recommended Improvements)

### Immediate (Before Database Integration)
1. **Add Error Boundaries** - Wrap components in error boundaries to handle failures gracefully
2. **Implement Loading Skeletons** - Add proper loading states for better UX
3. **Add Form Validation** - Use Zod to validate form inputs before API calls
4. **Fix Remaining Lint Errors** - Clean up warnings in other components

### Architecture Improvements (Next.js 15 Best Practices)
1. **Optimize Client/Server Split**:
   - Keep assist page as server component for initial load
   - Create separate client component for interactive game list
   - Use Suspense boundaries for streaming

2. **Implement Progressive Enhancement**:
   - Make forms work without JavaScript using server actions
   - Add `useTransition` for better loading states
   - Use optimistic updates when adding/deleting games

3. **Type Safety Improvements**:
   - Create typed form schemas instead of FormData
   - Add runtime validation with Zod
   - Type the localStorage data structure

4. **Performance Optimizations**:
   - Implement virtual scrolling for long game lists
   - Add image optimization for future photo features
   - Use dynamic imports for heavy components

### Database Integration Prep
1. **Create Database Schema**:
   - Users table (already exists)
   - Games/Experiences table
   - User_Games junction table for relationships

2. **Update Server Actions**:
   - Make `addExperience` actually persist to database
   - Make `getExperiences` fetch from database
   - Add proper error handling and retries

3. **Authentication Flow**:
   - Connect game saves to authenticated users
   - Add user context to server actions
   - Implement proper session management

### AI/Search Improvements
1. **Optimize GPT-5-mini Usage**:
   - Cache common searches
   - Implement rate limiting
   - Add fallback search methods

2. **Enhance Search Results**:
   - Add confidence scores to UI
   - Show source attribution
   - Allow manual game entry if AI fails

### Testing Strategy
1. **Unit Tests**: Test individual components and utilities
2. **Integration Tests**: Test form flow end-to-end
3. **E2E Tests**: Test full user journeys with Playwright
