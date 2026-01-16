const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 1) dùng transformer cho svg
config.transformer.babelTransformerPath =
  require.resolve("react-native-svg-transformer");

// 2) loại svg khỏi assetExts, thêm vào sourceExts
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");
module.exports = withNativeWind(config, { input: "./global.css" });
