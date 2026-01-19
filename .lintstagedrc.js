module.exports = {
  //Type-check TS/TSX
  '**/*.{ts,tsx}': () => 'pnpm ts-check',

  // ESLint + Prettier cho TS/TSX trong src
  'src/**/*.{ts,tsx}': () => ['pnpm lint:fix', 'pnpm prettier:fix'],

  // Prettify only Markdown and JSON files
  '**/*.{md,json}': () => 'pnpm prettier:fix'
}
