import fs from 'fs';
import path from 'path';

const root = (dir) => path.resolve(__dirname, '..', dir);

let localConfig = {};

if (fs.existsSync(root('server/config.local.js'))) {
  localConfig = require('./config.local');
}

// We need these globals to fetch data on server-side
global.HOSTNAME = 'localhost';
global.PORT = 3000;

const config = {
  http: {
    port: global.PORT,
    hostname: global.HOSTNAME,
    favicon: root('src/assets/favicon.ico'),
    static: {
      '/assets': root('src/assets'),
      '/build': root('build'),
    },
  },
  serverUrl: '',
  app: {
    name: 'OpenPitrix Dashboard',
    navs: [
      {
        title: 'Discover',
        value: [
          { title: 'Top Trending', value: 'top' },
          { title: 'Essential Apps', value: 'essential' },
        ],
      },
      {
        title: 'Categories',
        value: [
          { title: 'Software Infrastructure', value: 'software' },
          { title: 'Business Software', value: 'business' },
          { title: 'Development', value: 'develop' },
          { title: 'Operation & Maintenance', value: 'operation' },
          { title: 'Security', value: 'security' },
          { title: 'Analysis', value: 'analysis' },
        ],
      },
      {
        title: 'Cloud Manufacture',
        value: [
          { title: 'Amazon', value: 'amazon' },
          { title: 'Microsoft', value: 'microsoft' },
          { title: 'Google', value: 'google' },
          { title: 'QingCloud', value: 'qingcloud' },
          { title: 'VMWare', value: 'wmware' },
          { title: 'See All', value: 'all' },
        ],
      },
    ],
  },
};

const mergedConfig = Object.assign({}, config, localConfig);

export default mergedConfig;
