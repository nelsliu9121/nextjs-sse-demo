const config = require('@vercel/style-guide/prettier');

module.exports = {
...config,
printWidth: 120,
bracketSameLine: true,
jsxSingleQuote: true,
plugins: ['prettier-plugin-tailwindcss'],
};
