var
	_ = require('underscore'),
	moment = require('moment'),
	config = require('../../config/config'),
	viewConfigService = require('./viewConfigService');

//var actionCollections = {};

var maps = {};

module.exports = {
	store: function(action) {
		console.log(action);

		var id = action.payload.markerId;
		var mapId = action.instanceId;

		if (!maps[mapId]) {
			console.log("Unknown map %s, initialize a new collection for it", mapId)
			maps[mapId] = {
				name: viewConfigService.get(mapId).conf.mapName,
				markers: {}
			};
		}

		// Prepare the data to store
		var data = _.pick(action.payload, 'lat', 'lng', 'date');
		data = _.extend(data, action.payload.data);

		// Store/overwrite data
		maps[mapId].markers[id] = data;

		console.log(maps);

		console.log("%s element(s) stored in the collection %s", maps[mapId].markers.length, mapId);
	},

	getMaps: function() {
		return _.reduce(maps, function(memo, data, key) {
			memo.push({
				mapId: key,
				name: data.name
			});

			return memo;
		}, []);
	},

	getMap: function(mapId) {
		if (_.isUndefined(maps[mapId])) {
			return null;
		}

		var expiration = viewConfigService.get(mapId).conf.expiration || config.app.viewbox.defaultExpiration;

		if (expiration >= 0) {
			var expirationDate = moment().subtract(expiration, 'milliseconds');

			maps[mapId].markers = _.reduce(maps[mapId].markers, function(memo, data, key) {
				if (moment(data.date, moment.ISO_8601).isAfter(moment(expirationDate))) {
					memo[key] = data;
				}

				return memo;
			}, {});
		}

		var mapConfig = viewConfigService.get(mapId).conf.mapConfig;

		return {
			name: maps[mapId].name,
			config: {
				lat: mapConfig.centerLat,
				lng: mapConfig.centerLng,
				zoom: mapConfig.initialZoom
			},
			legendType: mapConfig.legendType,
			markers: maps[mapId].markers
		};
	}
};
