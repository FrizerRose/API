
// eslint-disable-next-line
const webpack = require('webpack');
// eslint-disable-next-line
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
// eslint-disable-next-line
const { WebpackPnpExternals } = require('webpack-pnp-externals');

module.exports = function(options) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    // watch: true,
    externals: [
      WebpackPnpExternals({ exclude: ['webpack/hot/poll?100'] }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
      new RunScriptWebpackPlugin({ name: options.output.filename }),
    ],
  };
};