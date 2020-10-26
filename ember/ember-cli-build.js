/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    fingerprint: {
      exclude: [
        'images/layers-2x.png',
        'images/layers.png',
        'images/marker-icon-2x.png',
        'images/marker-icon.png',
        'images/marker-shadow.png',
      ],
    },

    autoImport: {
      skipBabel: [
        {
          package: 'mapbox-gl',
          semverRange: '*',
        },
      ],
    },

    babel: {
      loose: true,
      plugins: [
        'transform-object-rest-spread',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        [require.resolve('ember-auto-import/babel-plugin')],
      ],
    },
    'ember-cli-babel': {
      includePolyfill: true,
    },
  });

  // require('resolve').sync(something, { basedir: project.root });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
