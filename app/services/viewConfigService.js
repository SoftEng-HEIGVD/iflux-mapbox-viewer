var
	_ = require('underscore'),
	fs = require('fs'),
	config = require('../../config/config');

var viewConfig = {};

module.exports = {
	load: function() {
		if (config.viewbox.storageEnabled) {
			fs.readFile(config.viewbox.storagePath + '/views.json', function(err, data) {
				if (err) {
					console.log(err);
				}
				else {
					viewConfig = JSON.parse(data);
				}
			});
		}
	},

	save: function() {
		if (config.viewbox.storageEnabled) {
			var configToSave = _.reduce(viewConfig, function(memo, config, key) {
				memo[key] = { conf: config.conf };
				return memo;
			}, {});

			fs.writeFile(config.viewbox.storagePath + '/views.json', JSON.stringify(configToSave), function (err) {
				if (err) {
					console.log(err);
				}
			});
		}
	},

	upsert: function(instanceId, config) {
		viewConfig[instanceId] = { conf: config };
		this.save();
	},

	getMaps: function() {
		return _.reduce(viewConfig, function(memo, config, key) {
			memo.push({
				mapId: key,
				name: config.conf.mapName
			});

			return memo;
		}, []);
	},

	get: function(instanceId) {
		return viewConfig[instanceId];
	}
};