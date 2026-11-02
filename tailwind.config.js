/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      dropShadow: {
        xs: '0 1px 1px rgba(0,0,0,0.05)',
        sm: '0 1px 2px rgba(0,0,0,0.08)',
        md: '0 2px 4px rgba(0,0,0,0.12)',
        lg: '0 4px 8px rgba(0,0,0,0.15)',
        xl: '0 8px 16px rgba(0,0,0,0.18)',
        '2xl': '0 12px 24px rgba(0,0,0,0.22)',
      },
      maxWidth: {
        '8xl': '1410px',
      },
      screens: {
        xs: '480px',
        md2: '950px',
        lg2: '1100px',
        lg3: '1150px',
        xl2: '1350px',
      },
      boxShadow: {
        'solid-black': '3px 3px 0px 0px #000000',
        'inner-red': 'inset 0 1px 3px 0 rgba(52, 9, 9, 0.502)',
      },
      fontSize: {
        9: '9px',
        10: '10px',
        11: '11px',
        12: '12px',
        13: '13px',
        14: '14px',
        15: '15px',
        16: '16px',
        17: '17px',
        18: '18px',
        19: '19px',
        20: '20px',
        22: '22px',
        24: '24px',
        26: '26px',
        28: '28px',
        30: '30px',
        32: '32px',
        36: '36px',
        40: '40px',
        48: '48px',
        56: '56px',
        64: '64px',
      },
      backgroundImage: {
        'btn-gradient': 'linear-gradient(180deg, #ffffff 0%, #F0ECE1 100%)',
        'btn-gradient-hover': 'linear-gradient(180deg, #F0ECE1 0%, #ffffff 100%)',
        'fancy-gradient': 'linear-gradient(180deg, #0A92A5 0%, #076976 100%)',
        'header-bgImage': 'linear-gradient(-180deg, #080808bf 0%, #060606 100%)',
        'header-bgImage-hover': 'linear-gradient(-180deg, #060606 0%, #080808bf 100%)',
        'gradient-nav': 'linear-gradient(180deg,hsla(0,0%,61%,.557),hsla(0,0%,86%,.275) 61%)',
        'gradient-red': 'linear-gradient(-180deg,#f72424,#bb1c00)',
        'gradient-primary': 'linear-gradient(90deg, #043C11 0%, #067A1A 50%, #089A20 100%)',
        'gradient-secondary': 'linear-gradient(90deg, #04B31C 0%, #08E226 52.88%, #00A417 100%)',
        // 'green-gradient': 'linear-gradient(90deg, #04B31C 0%, #08E226 52.88%, #00A417 100%)',
        'gradient-green': 'linear-gradient(to right, #04B31C, #08E226, #00A417)',
        'theme-navbar':
          'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
        'top-navbar': 'linear-gradient(180deg, #5f7fdb 0, #0cddff 100%)',
        'log-button': 'linear-gradient(-180deg, #F72424 0%, #BB1C00 100%)',
        'auth-gradient': 'linear-gradient(90deg,#020024,#090979 35%,#00d4ff)',
        'custom-overlay': 'linear-gradient(180deg, #00000005 27%, #1c282de0 83%)',
        'footer-gradient':
          'linear-gradient(-180deg, #243a48 20%, #172732 91%)',
      },
      colors: {
        mint: 'hsl(var(--mint))',
        fancy: 'hsl(var(--fancy))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))', // main color
          light: '#ffedcb',
          dark: '#ce8b00',
          dark2: '#9e6300',
          'dark-300': '#094E00',
          'dark-blue': '#071123',
          'light-blue': '#04A0E2',
          cream: '#faf5f3',
          white: '#FFFFFF',
          yellow: 'hsl(var(--yellow))',
          orange: 'hsl(var(--orange))',
          slate: 'hsl(var(--slate))',
          green: 'hsl(var(--green))',
          blue: 'hsl(var(--blue))',
          offwhite: 'hsl(var(--offwhite))',
          theme: '#243a48',
        },
        'odd-pink': {
          100: '#FDD4DD',
          300: '#FBBFCB',
          500: '#FAA9BA',
        },
        'odd-blue': {
          100: '#B9DDF7',
          300: '#95CCF3',
          500: '#72BBEF',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'fade-out': {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px 5px #08E226' },
          '50%': { boxShadow: '0 0 35px 10px #08E226' },
        },
        'deep-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
            filter: 'brightness(80%)',
          },
          '50%': {
            transform: 'scale(1.02)',
            opacity: '0.85',
            filter: 'brightness(115%)',
          },
        },
        menuHighlight: {
          '0%, 100%': {
            transform: 'scale(1)',
            backgroundColor: '#dc3545',
            color: '#fff',
          },
          '50%': {
            transform: 'scale(1.08)',
            backgroundColor: '#0d6efd',
            color: '#000',
          },
        },
        tagmenu: {
          '0%': {
            backgroundColor: '#f72424',
            color: '#fff',
            transform: 'scale(1)',
          },
          '33%': {
            backgroundColor: '#ffc107',
            color: '#000',
            transform: 'scale(1.12)',
          },
          '66%': {
            backgroundColor: '#ffffff',
            color: '#f72424',
            transform: 'scale(1.18)',
          },
          '100%': {
            backgroundColor: '#f72424',
            color: '#fff',
            transform: 'scale(1)',
          },
        },
        twinkling: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '.3',
          },
        },
        swapLeft: {
          '0%': {
            transform: 'translateX(0) scale(1)',
            zIndex: '2',
          },
          '50%': {
            transform: 'translateX(20px) scale(0.9)',
            zIndex: '1',
          },
          '100%': {
            transform: 'translateX(0) scale(1)',
            zIndex: '2',
          },
        },
        swapRight: {
          '0%': {
            transform: 'translateX(0) scale(0.9)',
            zIndex: '1',
          },
          '50%': {
            transform: 'translateX(-20px) scale(1)',
            zIndex: '2',
          },
          '100%': {
            transform: 'translateX(0) scale(0.9)',
            zIndex: '1',
          },
        },
        blinker: {
          '50%': { opacity: '0' },
        },
        'simple-scale': {
          '100%': {
            transform: 'scale(1.2)',
          },
        },
      },
      animation: {
        'deep-pulse': 'deep-pulse 1.5s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
        glow: 'glow 2s ease-in-out infinite',
        menuHighlight: 'menuHighlight 1s ease-in-out infinite',
        tagmenu: 'tagmenu 2s ease-in-out infinite',
        twinkling: 'twinkling 1.4s ease infinite',
        'swap-left': 'swapLeft .8s ease-in-out infinite',
        'swap-right': 'swapRight .8s ease-in-out infinite',
        blinker: 'blinker 1s linear infinite',
        'simple-scale': 'simple-scale 1s 1s linear infinite alternate',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        tahoma: ['Tahoma', 'sans-serif'],
        helvetica: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar')],
};
