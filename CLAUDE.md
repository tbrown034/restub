# Claude Development Preferences

This file contains preferences and guidelines for Claude when working on the Restub project.

## Development Commands

- **Dev Server**: `npm run dev` (uses Turbopack for faster builds)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type Check**: `npm run lint` (includes TypeScript checking)

## Project Guidelines

### Code Style
- Use TypeScript for all new files
- Follow existing component patterns in `app/components/`
- Use Tailwind CSS for styling with existing design system
- Maintain consistent gradient themes (purple-to-blue)
- Use semantic HTML and accessible markup

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