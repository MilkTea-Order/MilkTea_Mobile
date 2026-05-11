const { withNativeWind } = require("nativewind/metro");
const { getDefaultConfig } = require("expo/metro-config");
const { mergeConfig } = require("metro-config");

module.exports = function (baseConfig) {
  // Lấy default config từ Expo và merge với baseConfig
  const defaultConfig = mergeConfig(baseConfig, getDefaultConfig(__dirname));
  const {resolver: { assetExts, sourceExts }} = defaultConfig;

  // Tạo custom config cho SVG
  const customConfig = {
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
    },
  };
  // Merge lại để ra final config
  const finalConfig = mergeConfig(defaultConfig, customConfig);

  // Wrap với NativeWind
  return withNativeWind(finalConfig, { input: "./global.css" });
};



// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// // 1) dùng transformer cho svg
// config.transformer.babelTransformerPath =
//   require.resolve("react-native-svg-transformer");

// // 2) loại svg khỏi assetExts, thêm vào sourceExts
// config.resolver.assetExts = config.resolver.assetExts.filter(
//   (ext) => ext !== "svg"
// );
// config.resolver.sourceExts.push("svg");
// module.exports = withNativeWind(config, { input: "./global.css" });
