var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
		dotenv = require('dotenv'),
    env = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV != 'docker') {
	dotenv.load();
}

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'MapBox iFLUX Viewer',
			validity: {
				publibike: 3600000,
				citizen: -1
			}
    },
    port: process.env.PORT || 3004
  },

  test: {
    root: rootPath,
    app: {
			name: 'MapBox iFLUX Viewer',
			validity: {
				publibike: 3600000,
				citizen: -1
			}
    },
    port: process.env.PORT || 3004
  },

  production: {
    root: rootPath,
    app: {
			name: 'MapBox iFLUX Viewer',
			validity: {
				publibike: 3600000,
				citizen: -1
			}
    },
    port: process.env.PORT || 3004
  },

	docker: {
		root: rootPath,
		app: {
			name: 'MapBox iFLUX Viewer',
			validity: {
				publibike: 3600000,
				citizen: -1
			}
		},
		port: 3000
	}
};

module.exports = config[env];
