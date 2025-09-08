module.exports = {
  globDirectory: 'dist/my-workbox-pwa/browser/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,gif,svg,ico,webp,woff,woff2,ttf,eot}',
    '!**/node_modules/**/*',
    '!**/*-es5*.js', // Exclude ES5 bundles if you're using differential loading
  ],
  swSrc: 'src/sw-compiled.js', // Use the compiled version
  swDest: 'dist/my-workbox-pwa/browser/service-worker.js',
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  dontCacheBustURLsMatching: /\.\w{8}\./,
};