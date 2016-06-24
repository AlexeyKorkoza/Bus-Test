/**
 * Created by КРИВИЧАНИН on 24.06.2016.
 */
module.exports = {
  entry: './js/script.js',
  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
  devServer: {
    inline: true,
    port: 8080,
  } };
