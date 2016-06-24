module.exports = {
  entry: './js/script.js',
  output: {
    path: './dist',
    filename: 'bundle.js',
  },
  devServer: {
    inline: true,
    port: 8080,
  } };
