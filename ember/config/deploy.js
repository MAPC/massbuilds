/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {
  let ENV = {
    build: {
      environment: deployTarget,
    },

    'revision-data': {
      type: 'git-commit',
    },
  };

  if (deployTarget === 'staging') {
    ENV.rsync = {
      dest: 'massbuilds@prep.mapc.org:/var/www/massbuilds/ember',
      delete: false,
    };
  }

  if (deployTarget === 'production') {
    ENV.rsync = {
      dest: 'massbuilds@live.mapc.org:/var/www/massbuilds/ember',
      delete: false,
    };
  }

  return ENV;
};
