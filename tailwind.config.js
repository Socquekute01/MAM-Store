export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        chat: {
          primary: '#2563eb', // blue-600
          bg: '#f8fafc', // slate-50
          border: '#e2e8f0', // slate-200
          bot: '#475569', // slate-600
        },
      },
      borderRadius: {
        chat: '12px',
      },
    },
  },
};
