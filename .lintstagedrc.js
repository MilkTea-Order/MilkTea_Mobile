module.exports = {
  //Type-check TS/TSX
  '**/*.{ts,tsx}': () => 'npm run ts-check',

  // ESLint + Prettier cho TS/TSX trong src
  'src/**/*.{ts,tsx}': () => ['npm run lint:fix', 'npm run prettier:fix'],

  // Prettify only Markdown and JSON files
  '**/*.{md,json}': () => 'npm run prettier:fix'
}
