# Breakpoint System Documentation

This document outlines the breakpoint system used in the TripFinder EDU application and provides guidance on when to use each breakpoint.

## Available Breakpoints

### 1. Mobile Breakpoint (690px)

**When to use:**
- For mobile-specific UI adjustments
- When you need to completely change a component's layout for mobile
- For touch-optimized interfaces
- When hiding/showing elements that are only relevant on mobile

**Implementation:**
```tsx
import { useIsMobile } from "@/hooks/use-mobile";

function MyComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

### 2. Tailwind CSS Breakpoints

#### Small (sm: 640px and up)
**When to use:**
- For minor layout adjustments
- When elements need slightly more space
- For adjusting text alignment (e.g., `sm:text-left`)
- For changing flex direction (e.g., `sm:flex-row`)

**Example:**
```tsx
<div className="flex flex-col sm:flex-row">
  {/* Content that stacks on mobile, rows on sm and up */}
</div>
```

#### Medium (md: 768px and up)
**When to use:**
- For tablet and larger devices
- When adjusting grid layouts (e.g., `md:grid-cols-2`)
- For showing/hiding navigation elements
- For adjusting padding and margins for larger screens

**Example:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Single column on mobile, 2 columns on md, 3 columns on lg */}
</div>
```

#### Large (lg: 1024px and up)
**When to use:**
- For desktop layouts
- When implementing multi-column layouts
- For showing additional information that might be hidden on smaller screens
- For adjusting sidebar behavior

**Example:**
```tsx
<div className="hidden lg:block">
  {/* Content only visible on large screens */}
</div>
```

#### Extra Large (xl: 1280px and up)
**When to use:**
- For very large screens
- When optimizing for wide displays
- For adjusting maximum widths
- For implementing advanced layouts that require significant screen real estate

**Example:**
```tsx
<div className="max-w-5xl xl:max-w-7xl">
  {/* Wider container on extra large screens */}
</div>
```

### 3. Custom Breakpoint (1024px)

**When to use:**
- For specific component behaviors that align with the large screen breakpoint
- When you need to show/hide content based on desktop vs. mobile/tablet
- For adjusting data display (e.g., showing more columns in tables)

**Implementation:**
```tsx
const showDescription = window.innerWidth >= 1024;
```

## Best Practices

1. **Use the `useIsMobile` hook for mobile-specific logic**
   - This provides a consistent way to detect mobile devices
   - It handles window resize events automatically

2. **Prefer Tailwind's responsive classes when possible**
   - They're more declarative and easier to maintain
   - They work well with the utility-first CSS approach

3. **Mobile-first approach**
   - Design for mobile first, then enhance for larger screens
   - Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:) to add features for larger screens

4. **Be consistent with breakpoint usage**
   - Use the same breakpoints for similar UI patterns
   - Document any deviations from the standard breakpoints

5. **Test across different screen sizes**
   - Use browser developer tools to test responsive behavior
   - Test on actual devices when possible

## Common Patterns

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid that adapts to screen size */}
</div>
```

### Responsive Navigation
```tsx
<nav className="hidden md:flex">
  {/* Navigation visible on medium screens and up */}
</nav>
<button className="md:hidden">
  {/* Mobile menu button visible only on small screens */}
</button>
```

### Responsive Text
```tsx
<h1 className="text-xl md:text-2xl lg:text-3xl">
  {/* Text that scales with screen size */}
</h1>
```

### Conditional Rendering Based on Screen Size
```tsx
const isMobile = useIsMobile();

return (
  <div>
    {isMobile ? (
      <MobileView />
    ) : (
      <DesktopView />
    )}
  </div>
);
```

## Conclusion

The TripFinder EDU application uses a combination of a custom mobile breakpoint (690px) and Tailwind CSS breakpoints to create a responsive user experience. By following these guidelines, you can ensure a consistent and maintainable responsive design across the application. 