/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e6f7f7',
                    100: '#ccefef',
                    200: '#99dfdf',
                    300: '#66cfcf',
                    400: '#33bfbf',
                    500: '#14b8a6',
                    600: '#0f9384',
                    700: '#0b6e66',
                    800: '#074948',
                    900: '#04242a',
                },
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                border: '#e5e7eb', // gray-200
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(20, 184, 166, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
