import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#1D2939",
          hover: "#344054",
          active: "#9FF443", // Hijau neon/lime khas Cloit/Figma jika aktif atau warna aksen
          dark: "#101828",
        },
        brand: {
          blue: "#2563EB",
          dark: "#101828",
          gray: "#475467",
        },
      },
    },
  },
  plugins: [],
};
export default config;