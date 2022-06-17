const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");
const reactUtilsPath = path.join(__dirname, "../../../../packages/react-utils");
const clientPath = path.join(__dirname, "../../../../packages/client");
const walletPath = path.join(__dirname, "../../../../packages/wallet");
const hubPath = path.join(__dirname, "../../../../packages/hub");
const reactHubPath = path.join(__dirname, "../../../../packages/react-hub");
const jsWalletPath = path.join(__dirname, "../../../../packages/wallet-backend-js");
const webWalletPath = path.join(__dirname, "../../../../packages/wallet-backend-web");

module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat([
          reactUtilsPath,
          clientPath,
          walletPath,
          hubPath,
          reactHubPath,
          jsWalletPath,
          webWalletPath
        ]);
      }
      return webpackConfig;
    }
  }
};