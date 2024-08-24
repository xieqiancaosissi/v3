const webpack = require("webpack");
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
module.exports = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["@near-wallet-selector/wallet-connect"],
  experimental: {
    esmExternals: "loose",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
      config.plugins.push(
        new webpack.ProvidePlugin({
          fs: "browserify-fs",
        })
      );
    }

    return config;
  },
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.plugins.push(
  //       new BundleAnalyzerPlugin({
  //         analyzerMode: "static",
  //         reportFilename: "./analyze/client.html",
  //         openAnalyzer: false,
  //       })
  //     );
  //   } else {
  //     config.plugins.push(
  //       new BundleAnalyzerPlugin({
  //         analyzerMode: "static",
  //         reportFilename: "./analyze/server.html",
  //         openAnalyzer: false,
  //       })
  //     );
  //   }
  //   return config;
  // },
};
