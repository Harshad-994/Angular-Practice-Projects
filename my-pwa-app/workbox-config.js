module.exports = {
  globDirectory: "dist/my-pwa-app/browser/",
  globPatterns: [
    "**/*.{html,js,css}", // Core app files
    "**/*.{png,jpg,svg,ico}", // Images in assets folder
    "manifest.webmanifest", // PWA manifest
    // Add more patterns, e.g., 'fonts/*.{ttf,woff2}'
  ],
  globIgnores: [
    "**/*.map", // Ignore source maps
    "**/node_modules/**", // Ignore any node_modules in dist (if present)
  ],
  swDest: "dist/my-pwa-app/browser/custom-sw.js",
  ignoreURLParametersMatching: [/.*/],
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  skipWaiting: true,
  clientsClaim: true,
};
