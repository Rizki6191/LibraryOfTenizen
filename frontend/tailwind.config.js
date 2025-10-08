/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.8s ease-out',
        'slideDown': 'slideDown 0.6s ease-out',
        'slideInLeft': 'slideInLeft 0.6s ease-out',
        'contentSlideIn': 'contentSlideIn 0.6s ease-out',
        'cardFadeIn': 'cardFadeIn 0.6s ease-out',
        'slideInUp': 'slideInUp 0.5s ease-out',
        'profileSlideIn': 'profileSlideIn 0.6s ease-out',
        'bounceIn': 'bounceIn 1s ease-out',
        'pulse-custom': 'pulse 2s infinite',
        'sidebarFloatIn': 'sidebarFloatIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'fadeInDown': 'fadeInDown 0.6s ease-out',
        'menuItemSlideIn': 'menuItemSlideIn 0.6s ease-out',
        'pulseGlow': 'pulseGlow 2s infinite',
        'bounce-custom': 'bounce 2s infinite',
        'mobileSidebarIn': 'mobileSidebarIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'dropdownSlide': 'dropdownSlide 0.2s ease',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          'from': { transform: 'translateY(-100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' }
        },
        slideInLeft: {
          'from': { transform: 'translateX(-100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' }
        },
        contentSlideIn: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        cardFadeIn: {
          'from': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        slideInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        profileSlideIn: {
          'from': { opacity: '0', transform: 'translateX(-30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' }
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        pulse: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.6' }
        },
        sidebarFloatIn: {
          'from': { transform: 'translateX(-100%) rotate(-5deg)', opacity: '0' },
          'to': { transform: 'translateX(0) rotate(0)', opacity: '1' }
        },
        fadeInDown: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        menuItemSlideIn: {
          'from': { opacity: '0', transform: 'translateX(-30px) scale(0.9)' },
          'to': { opacity: '1', transform: 'translateX(0) scale(1)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)' }
        },
        bounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(-50%) scale(1)' },
          '40%': { transform: 'translateY(-50%) scale(1.1)' },
          '60%': { transform: 'translateY(-50%) scale(1.05)' }
        },
        mobileSidebarIn: {
          'from': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: '0', backdropFilter: 'blur(0)' },
          'to': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1', backdropFilter: 'blur(30px)' }
        },
        dropdownSlide: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
      }
    },
  },
  plugins: [],
}