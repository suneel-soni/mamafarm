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
        brand: {
          green: "#1F5A32",
          brown: "#A56A2A",
          cream: "#F7F2EB",
          wheat: "#E8D9B5",
        },
      },
    },
  },
  plugins: [],
};
export default config;
