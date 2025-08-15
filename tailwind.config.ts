import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Storyly Design System Colors
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          pressed: "var(--primary-pressed)",
          light: "var(--primary-light)",
          background: "var(--primary-background)",
          foreground: "var(--primary-foreground)",
        },
        
        // Neutral Gray Scale
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
        },
        
        white: "var(--white)",
        
        // Semantic Colors
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
        
        // System Colors (maintain shadcn/ui compatibility)
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        
        // Chart colors (keep existing)
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
      
      // Storyly Design System Extensions
      spacing: {
        'storyly-xs': 'var(--spacing-xs, 0.25rem)',
        'storyly-sm': 'var(--spacing-sm, 0.5rem)', 
        'storyly-md': 'var(--spacing-md, 1rem)',
        'storyly-lg': 'var(--spacing-lg, 1.5rem)',
        'storyly-xl': 'var(--spacing-xl, 2rem)',
        'storyly-2xl': 'var(--spacing-2xl, 3rem)',
        'storyly-3xl': 'var(--spacing-3xl, 4rem)',
        'sidebar': 'var(--sidebar-width)',
        'header': 'var(--header-height)',
      },
      
      boxShadow: {
        'storyly-sm': 'var(--shadow-sm)',
        'storyly-md': 'var(--shadow-md)', 
        'storyly-lg': 'var(--shadow-lg)',
        'storyly-xl': 'var(--shadow-xl)',
        'focus': 'var(--focus-ring)',
      },
      
      fontSize: {
        'storyly-xs': '0.75rem',
        'storyly-sm': '0.875rem',
        'storyly-base': '1rem', 
        'storyly-lg': '1.125rem',
        'storyly-xl': '1.25rem',
        'storyly-2xl': '1.5rem',
        'storyly-3xl': '1.875rem',
      },
      
      fontWeight: {
        'storyly-normal': '400',
        'storyly-medium': '500',
        'storyly-semibold': '600', 
        'storyly-bold': '700',
      },
      
      lineHeight: {
        'storyly-tight': '1.25',
        'storyly-normal': '1.5',
        'storyly-relaxed': '1.75',
      },
      
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
