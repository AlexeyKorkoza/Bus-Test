module.exports = {
  entry: './js/script.js',
  output: {
    path: './',
    filename: 'dist/bundle.js',
  },
  devServer: {
    inline: true,
    port: 8080,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
};
