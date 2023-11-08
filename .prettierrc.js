const config = require('@vercel/style-guide/prettier');

module.exports = {
    ...config,
    printWidth: 120,
    bracketSameLine: true,
    jsxSingleQuote: true,
    endOfLine: "lf",
    plugins: ['prettier-plugin-tailwindcss'],
};
