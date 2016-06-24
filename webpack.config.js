module.exports = {
  entry: './js/script.js',
  output: {
    path: './bundleDirectory',
    filename: 'bundle.js',
  },
  devServer: {
    inline: true,
    port: 8080,
  } };
