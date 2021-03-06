module.exports = app => {
  // disable babel server env plugins transform
  process.env.BABEL_ENV = '';

  const webpack = require('webpack');
  const webpackMiddleware = require('koa-webpack');
  const webpackConfig = require('../webpack.dev');

  app.use(
    webpackMiddleware({
      compiler: webpack(webpackConfig),
      // hot: false,
      dev: {
        noInfo: false,
        quiet: false,
        watchOptions: {
          aggregateTimeout: 300,
          // poll: true,
          ignored: /node_modules/
        },
        stats: {
          colors: true,
          // hash: true,
          timings: true,
          // version: false,
          chunks: true
          // modules: true,
          // children: false,
          // chunkModules: true
        }
      }
    })
  );
};
