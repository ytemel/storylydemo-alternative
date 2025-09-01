/**
 * Storyly Design System Utilities
 * 
 * This file provides easy access to design system tokens and utility functions
 * based on the extracted Storyly design system specifications.
 */

import { cn } from "@/lib/utils"

// Design System Constants
export const STORYLY_TOKENS = {
  // Colors
  colors: {
    primary: {
      DEFAULT: "#8B5CF6",
      hover: "#7C3AED", 
      pressed: "#6D28D9",
      light: "#EDE9FE",
      background: "rgba(139, 92, 246, 0.1)",
    },
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6", 
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
    semantic: {
      success: "#10B981",
      warning: "#F59E0B", 
      error: "#EF4444",
      info: "#3B82F6",
    },
  },
  
  // Layout
  layout: {
    sidebarWidth: "240px",
    headerHeight: "64px",
    contentPadding: "2rem",
  },
  
  // Typography
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem", 
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  
  // Spacing
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  
  // Border Radius
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem", 
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  
  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  
  // Animations
  animations: {
    hover: "150ms ease-in-out",
    modal: "200ms ease-out", 
    button: "100ms ease-in-out",
  },
} as const

// Component Style Generators
export const storylyStyles = {
  // Navigation Components
  navItem: (active = false) => cn(
    "flex items-center gap-3 px-6 py-3 mx-4 mb-1 rounded-lg transition-colors duration-150",
    active 
      ? "bg-primary-light text-primary font-semibold"
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
  ),
  
  // Card Components
  card: (variant: "default" | "widget" | "preview" = "default") => cn(
    "bg-white border border-gray-200 rounded-xl transition-all duration-150 shadow-storyly-sm hover:shadow-storyly-md hover:border-gray-300",
    variant === "widget" && "cursor-pointer min-h-[120px] p-4",
    variant === "preview" && "aspect-video overflow-hidden p-4",
    variant === "default" && "p-6"
  ),
  
  // Button Components  
  button: (variant: "primary" | "secondary" | "ghost" = "primary", size: "sm" | "md" | "lg" = "md") => cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-100",
    {
      primary: "bg-primary text-white shadow-storyly-sm hover:bg-primary-hover hover:shadow-storyly-md active:bg-primary-pressed",
      secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400", 
      ghost: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }[variant],
    {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-3 text-base"
    }[size]
  ),
  
  // Form Components
  input: () => cn(
    "w-full px-4 py-3 rounded-lg text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400",
    "transition-all duration-150 focus:border-primary focus:shadow-focus focus:outline-none"
  ),
  
  // Badge Components
  badge: (variant: "default" | "success" | "warning" | "purple" = "default") => cn(
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
    {
      default: "bg-gray-100 text-gray-700",
      success: "bg-green-50 text-green-800 border border-green-200",
      warning: "bg-yellow-50 text-yellow-800 border border-yellow-200", 
      purple: "bg-primary-light text-primary-pressed border border-purple-200"
    }[variant]
  ),
  
  // Typography
  heading: (level: 1 | 2 | 3 = 1) => cn(
    "font-semibold text-gray-900 leading-tight",
    {
      1: "text-3xl font-bold",
      2: "text-2xl",
      3: "text-xl"
    }[level]
  ),
  
  bodyText: (size: "sm" | "base" = "sm") => cn(
    "text-gray-700 leading-normal",
    size === "sm" ? "text-sm" : "text-base"
  ),
  
  captionText: () => "text-xs text-gray-500 leading-normal",
  
  // Layout Components
  sidebar: () => "bg-white border-r border-gray-200 w-sidebar py-4",
  
  mainContent: () => "min-h-screen bg-gray-50 pt-8 pr-8 pb-8",
  
  header: () => "bg-white border-b border-gray-200 h-header px-8 flex items-center",
  
} as const

// Utility Functions
export const getStorylyColor = (path: string) => {
  const keys = path.split('.')
  let value: any = STORYLY_TOKENS.colors
  
  for (const key of keys) {
    value = value?.[key]
  }
  
  return value || '#000000'
}

export const getStorylySpacing = (size: keyof typeof STORYLY_TOKENS.spacing) => {
  return STORYLY_TOKENS.spacing[size]
}

export const getStorylyShadow = (size: keyof typeof STORYLY_TOKENS.shadows) => {
  return STORYLY_TOKENS.shadows[size]
}

// Component Presets
export const STORYLY_PRESETS = {
  dashboardLayout: {
    structure: "sidebar + main content",
    sidebarWidth: STORYLY_TOKENS.layout.sidebarWidth,
    contentPadding: STORYLY_TOKENS.layout.contentPadding,
    headerHeight: STORYLY_TOKENS.layout.headerHeight,
  },
  
  cardGrid: {
    gap: "1.5rem",
    columns: "repeat(auto-fit, minmax(300px, 1fr))",
    minCardWidth: "300px",
  },
  
  widgetPreviewGrid: {
    gap: "2rem", 
    columns: "repeat(auto-fit, minmax(250px, 1fr))",
  },
} as const

export default storylyStyles