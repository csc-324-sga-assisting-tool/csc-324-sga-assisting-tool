import type {Config} from 'tailwindcss';

const config: Config = {
  darkMode: 'selector',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  safelist: [
    {
      pattern:
        /(bg|text|border)-(gray|blue|green|red|yellow|amber|slate|zinc|neutral|stone|orange|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)./,
    },
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'pallete-1': '#baabcd',
      'pallete-2': '#947DB1',
      'pallete-3': '#58058B',
      'pallete-4': '#430A71',
      'pallete-5': '#300B59',
    },
    container: {
      center: true,
    },
  },
  plugins: [require('flowbite/plugin')],
};

export default config;
