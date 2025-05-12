# Habit Tracker Style Guide

This style guide defines the visual language for the habit tracker application, ensuring consistency across all components and screens.

## Color Palette

### Primary Colors

| Color Name      | Hex Code  | Role                                      | CSS Variable              |
|-----------------|-----------|-------------------------------------------|---------------------------|
| Primary Blue    | `#4F46E5` | Primary actions, buttons, links, branding | `--color-primary`         |
| Primary Hover   | `#4338CA` | Hover state for primary elements          | `--color-primary-hover`   |
| Primary Focus   | `#6366F1` | Focus state for primary elements          | `--color-primary-focus`   |

### Secondary Colors

| Color Name      | Hex Code  | Role                                      | CSS Variable              |
|-----------------|-----------|-------------------------------------------|---------------------------|
| Success Green   | `#10B981` | Completion, success states, positive indicators | `--color-success`    |
| Warning Amber   | `#F59E0B` | Warnings, important notifications         | `--color-warning`         |
| Danger Red      | `#EF4444` | Destructive actions, errors               | `--color-danger`          |

### Neutral Colors

| Color Name      | Hex Code  | Role                                      | CSS Variable              |
|-----------------|-----------|-------------------------------------------|---------------------------|
| Background      | `#F9FAFB` | Page background                           | `--color-background`      |
| Card Background | `#FFFFFF` | Card backgrounds                          | `--color-card-bg`         |
| Border Light    | `#E5E7EB` | Light borders, dividers                   | `--color-border-light`    |
| Border          | `#D1D5DB` | Standard borders                          | `--color-border`          |
| Text Primary    | `#111827` | Primary text                              | `--color-text-primary`    |
| Text Secondary  | `#6B7280` | Secondary text, labels                    | `--color-text-secondary`  |
| Text Tertiary   | `#9CA3AF` | Placeholder text, disabled states         | `--color-text-tertiary`   |

## Typography

### Font Family

- **Primary Font:** Inter, system-ui, sans-serif
- **Fallback Stack:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif

### Type Scale

| Element                | Size (px) | Weight    | Line Height | CSS Class                      |
|------------------------|-----------|-----------|-------------|--------------------------------|
| Page Title (h1)        | 24px      | Bold (700)| 1.2         | `.text-page-title`            |
| Section Header (h2)    | 18px      | Bold (700)| 1.25        | `.text-section-header`        |
| Card Title (h3)        | 16px      | Semibold (600) | 1.35   | `.text-card-title`            |
| Body Text              | 14px      | Regular (400) | 1.5     | `.text-body`                  |
| Small Text             | 12px      | Regular (400) | 1.5     | `.text-small`                 |
| Labels, Badges         | 12px      | Medium (500) | 1.33    | `.text-label`                 |

### Type Hierarchy Example

```css
.text-page-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-primary);
  margin-bottom: 24px;
}

.text-section-header {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}

.text-card-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--color-text-primary);
}

.text-body {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.text-small {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.text-label {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.33;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}
```

## Spacing System

### Base Unit

The base spacing unit is 4px. All spacing values should be multiples of this base unit.

### Spacing Scale

| Name           | Size     | Usage                                      | CSS Variable               |
|----------------|----------|--------------------------------------------|-----------------------------|
| xs             | 4px      | Minimal separation, tight elements          | `--space-xs`               |
| sm             | 8px      | Default spacing between related elements    | `--space-sm`               |
| md             | 16px     | Standard spacing between components         | `--space-md`               |
| lg             | 24px     | Spacing between sections                    | `--space-lg`               |
| xl             | 32px     | Major section separation                    | `--space-xl`               |
| 2xl            | 48px     | Page section separation                     | `--space-2xl`              |

### Component-Specific Spacing

| Component            | Internal Padding | External Margin     | Notes                        |
|----------------------|------------------|---------------------|-----------------------------|
| Dashboard Cards      | 20px (--space-md+4px) | 24px bottom (--space-lg) | Rounded corners: 12px |
| Habit Cards          | 16px (--space-md) | 12px bottom | Left border: 4px for category |
| Section Headers      | N/A | 24px bottom, 32px top | Includes icon with 8px right margin |
| Form Fields          | 12px vertical, 16px horizontal | 16px bottom | Label: 8px bottom margin |
| Buttons (standard)   | 10px vertical, 16px horizontal | Variable | Focus ring: 3px, offset: 2px |
| Buttons (small)      | 8px vertical, 12px horizontal | Variable | Compact size for secondary actions |

## Border & Shadow System

### Borders

| Type               | Width    | Color                  | Radius   | CSS Class                 |
|--------------------|----------|------------------------|----------|---------------------------|
| Card Border        | 1px      | var(--color-border-light) | 12px     | `.border-card`           |
| Input Border       | 1px      | var(--color-border)    | 8px      | `.border-input`          |
| Focus Ring         | 3px      | var(--color-primary-focus) | Inherit | `.focus-ring`            |
| Divider            | 1px      | var(--color-border-light) | 0        | `.divider`               |
| Accent Left Border | 4px      | Various                | 0        | `.border-l-accent`       |

### Shadows

| Type               | Values                                       | Usage                    | CSS Class              |
|--------------------|----------------------------------------------|--------------------------|------------------------|
| Card Shadow        | `0 1px 3px rgba(0,0,0,0.05)`                | Default card shadow      | `.shadow-card`         |
| Card Shadow Hover  | `0 10px 15px -3px rgba(0,0,0,0.1)`          | Card hover state         | `.shadow-card-hover`   |
| Dropdown Shadow    | `0 4px 6px -1px rgba(0,0,0,0.1)`            | Dropdowns, tooltips      | `.shadow-dropdown`     |
| Button Shadow      | `0 2px 4px rgba(0,0,0,0.05)`                | Buttons                  | `.shadow-button`       |

## Icons

### Icon System

Use Lucide React icons throughout the application for consistency.

### Icon Sizes

| Context            | Size     | Stroke Width | CSS Class              |
|--------------------|----------|--------------|------------------------|
| Navigation         | 24px     | 2px          | `.icon-navigation`     |
| Section Headers    | 20px     | 2px          | `.icon-section`        |
| Within Text        | 16px     | 2px          | `.icon-inline`         |
| Button Icons       | 16px     | 2px          | `.icon-button`         |
| Status Indicators  | 12px     | 2px          | `.icon-status`         |

### Icon + Text Alignment

Always vertically center icons with accompanying text. Add appropriate spacing:
- For icons before text: 8px right margin
- For icons after text: 8px left margin

## Interactive Elements

### Buttons

| State              | Background             | Text Color             | Border                 | Transition             |
|--------------------|------------------------|------------------------|------------------------|------------------------|
| Primary Default    | var(--color-primary)   | white                  | none                   | all 200ms ease         |
| Primary Hover      | var(--color-primary-hover) | white              | none                   | transform scale(1.02)  |
| Primary Active     | var(--color-primary-hover) | white              | none                   | transform scale(0.98)  |
| Primary Focus      | var(--color-primary)   | white                  | 3px ring               | none                   |
| Secondary Default  | white                  | var(--color-text-primary) | var(--color-border) | all 200ms ease         |
| Secondary Hover    | var(--color-background) | var(--color-text-primary) | var(--color-primary) | none                   |
| Danger Default     | white                  | var(--color-danger)    | var(--color-danger)    | all 200ms ease         |
| Danger Hover       | var(--color-danger)    | white                  | var(--color-danger)    | none                   |

### Form Elements

| Element            | Height    | Padding              | Border                 | Background             |
|--------------------|-----------|----------------------|------------------------|------------------------|
| Text Input         | 40px      | 12px 16px            | 1px var(--color-border) | white                  |
| Select             | 40px      | 12px 16px            | 1px var(--color-border) | white                  |
| Checkbox           | 20px      | n/a                  | 2px var(--color-border) | white                  |
| Radio              | 20px      | n/a                  | 2px var(--color-border) | white                  |
| Toggle             | 24px      | n/a                  | none                   | var(--color-background) |

## Responsive Breakpoints

| Breakpoint Name    | Width (px) | CSS Media Query                           | Target Devices           |
|--------------------|------------|-------------------------------------------|--------------------------|
| xs                 | 0          | Default                                   | Small mobile devices     |
| sm                 | 640px      | `@media (min-width: 640px)`               | Large mobile devices     |
| md                 | 768px      | `@media (min-width: 768px)`               | Tablets                  |
| lg                 | 1024px     | `@media (min-width: 1024px)`              | Laptops                  |
| xl                 | 1280px     | `@media (min-width: 1280px)`              | Desktops                 |
| 2xl                | 1536px     | `@media (min-width: 1536px)`              | Large displays           |

## Animation Guidelines

### Timing Functions

- **Standard:** `transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Entrance:** `transition: all 300ms cubic-bezier(0, 0, 0.2, 1)`
- **Exit:** `transition: all 200ms cubic-bezier(0.4, 0, 1, 1)`

### Duration Guidelines

- **Quick Feedback:** 100-200ms
- **Standard Transitions:** 200-300ms
- **Complex Animations:** 400-500ms

### Animation Examples

```css
/* Button hover/active states */
.btn-primary {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(1px);
}

/* Card hover animation */
.card {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}

/* Checkbox completion animation */
@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.checkbox.checked .checkmark {
  animation: checkmark 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

## Accessibility Guidelines

### Color Contrast

- Text on background: Minimum 4.5:1 ratio
- Large text on background: Minimum 3:1 ratio
- UI components and graphical objects: Minimum 3:1 ratio against adjacent colors

### Focus States

All interactive elements must have visible focus states:
- Focus ring: 3px, var(--color-primary-focus)
- Offset: 2px from the element
- Never remove outline without providing alternative visible focus indication

### Touch Targets

- Minimum size: 44×44px for all touch targets
- Spacing between touch targets: Minimum 8px

By adhering to this style guide, the habit tracker application will maintain a consistent, accessible, and visually appealing design language throughout all components and screens.