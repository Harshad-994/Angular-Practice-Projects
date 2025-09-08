import { resolve } from "path";

export const mode = "production";
export const entry = "./src/sw-source.js";
const _dirname = import.meta.dirname;
export const output = {
  path: resolve(_dirname, "src"),
  filename: "sw-compiled.js",
};
export const module = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    },
  ],
};
