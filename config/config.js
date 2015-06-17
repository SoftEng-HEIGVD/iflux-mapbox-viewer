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
      name: 'MapBox iFLUX Viewer'
    },
	  viewbox: {
			storageEnabled: true,
			storagePath: "/tmp",
		  actionType: process.env.VIEWBOX_ACTION_TYPE,
		  defaultExpiration: 300000
		},
    port: process.env.PORT || 3004
  },

  test: {
    root: rootPath,
    app: {
			name: 'MapBox iFLUX Viewer'
    },
	  viewbox: {
			storageEnabled: false,
			storagePath: "",
		  actionType: process.env.VIEWBOX_ACTION_TYPE,
		  defaultExpiration: 300000
		},
    port: process.env.PORT || 3004
  },

  production: {
    root: rootPath,
    app: {
			name: 'MapBox iFLUX Viewer'
    },
	  viewbox: {
			storageEnabled: true,
			storagePath: "",
		  actionType: process.env.VIEWBOX_ACTION_TYPE,
		  defaultExpiration: 300000
		},
    port: process.env.PORT || 3004
  },

	docker: {
		root: rootPath,
		app: {
			name: 'MapBox iFLUX Viewer'
		},
		viewbox: {
			storageEnabled: true,
			storagePath: "/data/viewbox",
		  actionType: process.env.VIEWBOX_ACTION_TYPE,
			defaultExpiration: 300000
		},
		port: 3000
	}
};

module.exports = config[env];
