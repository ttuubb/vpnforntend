const { getDefaultConfig } = require('@expo/metro-config');

const { resolver: { sourceExts, assetExts } } = getDefaultConfig(__dirname);

module.exports = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg').concat(['png', 'jpg', 'jpeg']), // 添加 'png', 'jpg', 'jpeg' 扩展名
    sourceExts: [...sourceExts, 'svg'],
  },
};