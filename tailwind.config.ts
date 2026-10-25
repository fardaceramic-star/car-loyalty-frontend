import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#667EEA',
        secondary: '#764BA2',
        accent: '#FBBF24',
      },
    },
  },
  plugins: [],
};
export default config;