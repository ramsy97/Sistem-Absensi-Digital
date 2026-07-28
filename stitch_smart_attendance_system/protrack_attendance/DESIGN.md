---
name: ProTrack Attendance
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444653'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#273545'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e4c5c'
  on-tertiary-container: '#adbccf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#d5e4f8'
  tertiary-fixed-dim: '#b9c8db'
  on-tertiary-fixed: '#0e1d2b'
  on-tertiary-fixed-variant: '#3a4858'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: auto
  max-width-content: 480px
---

## Brand & Style
The design system is engineered for high-stakes enterprise environments where reliability and clarity are paramount. The brand personality is professional, authoritative, and efficient, aimed at HR administrators and a diverse workforce. 

The aesthetic follows a **Corporate / Modern** style with a focus on high-density information display and clear action hierarchies. It prioritizes "Utility over Decoration," ensuring that the core task—marking attendance—is never more than one tap away. The visual language uses generous whitespace to prevent data fatigue and relies on subtle tonal shifts to categorize different information types.

## Colors
This design system utilizes a high-contrast palette to ensure accessibility and professional rigor. 

- **Primary Blue (#1E40AF):** Used for key actions (Check-In/Out), active navigation states, and primary brand markers.
- **Secondary White (#FFFFFF):** Serves as the primary surface color for cards and containers to maximize legibility.
- **Accent Light Blue (#DBEAFE):** Used for subtle background fills, hover states, and to group related data points without the visual weight of the primary blue.
- **Status Colors:** Success Green and Error Red are strictly reserved for attendance status (Present/Late) and validation feedback.
- **Surface Background:** A very light cool gray (#F8FAFC) differentiates the "canvas" from the white "content cards."

## Typography
The typography system uses a tiered approach to separate intent. 

**Manrope** is used for headlines and branding to provide a modern, slightly rounded professional feel. **Inter** is the workhorse for all body text and UI controls, chosen for its exceptional legibility on small screens. **JetBrains Mono** is used sparingly for time-stamps and numeric data (like employee IDs or clock-in times) to ensure tabular alignment and a precise, "digital log" feel.

On mobile, display sizes scale down aggressively to ensure the "Check-In" button and the current time remain visible above the fold.

## Layout & Spacing
The design system adopts a **Mobile-First Fixed Grid** philosophy. Even on desktop displays, the primary attendance dashboard is contained within a centered 480px column to maintain focus and mimic the intuitive nature of a mobile app.

- **Spacing Rhythm:** Based on a 4px baseline grid. Most components use 16px (md) for internal padding.
- **Desktop Strategy:** Content is centered with wide "safe-area" margins. Sidebars on desktop are used exclusively for secondary navigation, keeping the "Clock-In" action central.
- **Touch Targets:** All interactive elements (buttons, inputs) maintain a minimum height of 48px to accommodate rapid touch interactions during shift starts.

## Elevation & Depth
This design system uses **Tonal Layers** combined with **Low-Contrast Outlines** to create depth without visual clutter.

1.  **Level 0 (Background):** The canvas (#F8FAFC).
2.  **Level 1 (Cards):** Main content areas use a white background with a 1px border (#E2E8F0). No shadows are used here to keep the UI flat and "locked-in."
3.  **Level 2 (Active States):** Primary buttons use a high-saturation primary color.
4.  **Level 3 (Modals/Overlays):** For clock-in confirmations, a soft ambient shadow (0px 10px 15px -3px rgba(30, 64, 175, 0.1)) is used to lift the element above the UI.

Depth is used sparingly to signify importance; the more "elevated" an item looks, the more critical the action.

## Shapes
The shape language is **Rounded (0.5rem / 8px)**. This radius is applied to all standard containers, input fields, and buttons. It strikes a balance between the clinical feel of sharp corners and the overly casual nature of pill-shapes.

- **Standard (8px):** Primary buttons, cards, and input fields.
- **Large (16px):** Used for high-level dashboard containers and success/error modals.
- **Full (Pill):** Reserved exclusively for status chips (e.g., "On Time," "Absent") to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary Attendance Button:** Large, spans full width of the container. Background: `#1E40AF`, Text: White. Bold weight.
- **Secondary Action:** Ghost style with `#1E40AF` border and text.

### Chips (Status Indicators)
- Small, pill-shaped elements with low-opacity backgrounds. 
- **Present:** Text: `#065F46`, Background: `#D1FAE5`.
- **Late:** Text: `#991B1B`, Background: `#FEE2E2`.

### Cards
- White background, 8px border radius, 1px light gray border. Cards group "Today's Schedule," "Weekly Summary," and "History."

### Lists
- History items use a clean horizontal layout with `data-mono` for time-stamps. Each row has a thin bottom divider.

### Input Fields
- Labeled clearly with `label-caps`. 48px height. Focus state uses a 2px `#DBEAFE` outer glow and `#1E40AF` border.

### Attendance Clock
- A specialized component showing the current server time in `headline-lg` using `data-mono` font weight, ensuring time is the most visible element on the dashboard.