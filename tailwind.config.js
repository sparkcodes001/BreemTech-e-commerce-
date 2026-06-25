/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Black to White theme - BREEMTECH
        primary: {
          50: "#f5f5f5",
          100: "#e8e8e8",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#1a1a1a",
        },
        dark: {
          DEFAULT: "#141414",
          100: "#1c1c1c",
          200: "#232323",
          300: "#2a2a2a",
          400: "#333333",
        },
        light: {
          DEFAULT: "#f0efed",
          100: "#e8e7e5",
          200: "#d9d8d6",
        },
        accent: "#c9a84c",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #141414 0%, #2a2a2a 100%)",
        "gradient-light": "linear-gradient(135deg, #f0efed 0%, #d1d1d1 100%)",
      },
    },
  },
  plugins: [],
};
