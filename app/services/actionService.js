var
	_ = require('underscore'),
	moment = require('moment'),
	config = require('../../config/config');

var actionCollections = {};

module.exports = {
	store: function(action) {
		var collectionName = action.properties.markerType;
		var id = action.properties.data[action.properties.key];

		if (!actionCollections[collectionName]) {
			console.log("Unknown collection %s, initialize a new collection for it", collectionName)
			actionCollections[collectionName] = [];
		}

		var data = _.pick(action.properties, 'lat', 'lng', 'date');

		data = _.extend(data, action.properties.data);

		var idx = _.findIndex(actionCollections[collectionName], { id: id });

		if (idx == -1) {
			actionCollections[collectionName].push(data);
		}
		else {
			actionCollections[collectionName][idx] = data;
		}

		console.log("%s element(s) stored in the collection %s", actionCollections[collectionName].length, collectionName);
	},

	update: function(action) {
		this.store(action);
	},

	getCollection: function(collection) {
		if (_.isUndefined(actionCollections[collection])) {
			return [];
		}

		if (config.app.validity[collection] >= 0) {
			var expirationDate = moment().subtract(config.app.validity[collection], 'milliseconds');

			actionCollections[collection] = _.filter(actionCollections[collection], function(data) {
				return moment(data.date, moment.ISO_8601).isAfter(moment(expirationDate));
			});
		}

		return actionCollections[collection];
	}
};
