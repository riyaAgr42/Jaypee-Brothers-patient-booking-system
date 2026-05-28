/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#14B8A6",
        background: "#F8FAFC",
        card: "#FFFFFF",
        textPrimary: "#0F172A",
        textSecondary: "#64748B",
        danger: "#EF4444"
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"]
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(20, 184, 166, 0.12))"
      }
    }
  },
  plugins: []
};
