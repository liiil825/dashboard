const translations = {
  en: {
    translation: require('../src/locales/en/translation.json')
  },
  zh: {
    translation: Object.assign(
      {},
      require('../src/locales/zh/apps.json'),
      require('../src/locales/zh/translation.json')
    )
  }
};

module.exports = {
  // preload: false,
  // load: 'currentOnly',

  // init common resource
  resources: translations,

  lng: 'zh',
  fallbackLng: 'en',
  // debug: process.env.NODE_ENV !== 'production',

  whitelist: ['en', 'zh'],

  // have a common namespace used around the full app
  ns: ['translation'],
  defaultNS: 'translation',

  interpolation: {
    escapeValue: false // not needed for react!!
    // formatSeparator: ","
  },

  react: {
    wait: false // set wait to false when on SSR
  }
};
