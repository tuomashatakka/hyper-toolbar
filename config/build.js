const { DefinePlugin } = require('webpack')

module.exports = {
  // context: __dirname + '/..',
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        use: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new DefinePlugin(JSON.stringify({
      'global.BUILD': true,
    }))
  ],
  devtool: "inline-source-map",
}
