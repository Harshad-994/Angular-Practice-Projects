import { build } from "esbuild";
import { injectManifest } from "workbox-build";
import path from "path";

async function buildServiceWorker() {
  console.log("Building service worker...");

  try {
    // Step 1: Bundle the service worker with esbuild
    await build({
      entryPoints: ["src/sw-source.js"],
      bundle: true,
      outfile: "src/sw-compiled.js",
      format: "iife",
      target: "es2017",
      minify: true,
      sourcemap: false,
    });

    console.log("Service worker bundled successfully");

    // Step 2: Inject manifest with Workbox
    const { count, size, warnings } = await injectManifest({
      globDirectory: "dist/workbox-esbuild/browser/",
      globPatterns: [
        "**/*.{html,js,css,png,jpg,jpeg,gif,svg,ico,webp,woff,woff2,ttf,eot}",
      ],
      swSrc: "src/sw-compiled.js",
      swDest: "dist/workbox-esbuild/browser/service-worker.js",
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      dontCacheBustURLsMatching: /\.\w{8}\./,
    });

    if (warnings.length > 0) {
      console.warn("Warnings:", warnings);
    }

    console.log(
      `Precache manifest injected: ${count} files, ${(
        size /
        1024 /
        1024
      ).toFixed(2)} MB total`
    );
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildServiceWorker();
