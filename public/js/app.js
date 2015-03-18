var app = angular.module('demoapp', ['leaflet-directive']);

var defaults = {
	tileLayer: "http://api.tiles.mapbox.com/v4/prevole.lg1gah58/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicHJldm9sZSIsImEiOiJYblZPX3d3In0.AtoGoTAtUJAcBDEI0df6qw"
};

app.factory('DataServiceFactory', ['$http', function($http) {
	return {
		getData: function(collection) {
			return $http({
				url: '/data/' + collection
			})
			.then(function(res) {
				return res.data;
			});
		}
	}
}]);

var changeStateActions = {
	created: 'orange',
	assigned: 'blue',
	acknowledged: 'yellow',
	in_progress: 'purple',
	rejected: 'red',
	resolved: 'green'
};

app.controller('PublibikeMapController', ['$scope', '$interval', 'leafletData', 'DataServiceFactory', function($scope, $interval, leafletData, dataService) {
	var defineColor = function(remainingBikes) {
		if (remainingBikes > 0 && remainingBikes < 3) {
			return 'orange';
		}
		else if (remainingBikes >= 3) {
			return 'green';
		}
		else {
			return 'red';
		}
	};

	$scope.mapMarkers = [];

	$scope.defaults = defaults;

	$scope.mapCenter = {
		lat: 46.801111,
		lng: 8.226667,
		zoom: 9
	};

	var fn = function () {
		dataService
			.getData('publibike')
			.then(function (data) {
				$scope.mapMarkers = [];

				_.each(data, function (item) {
					$scope.mapMarkers.push({
						lat: item.lat,
						lng: item.lng,
						compileMessage: true,
						message: '<p>At ' + item.date + ', only ' + item.remainingBikes + ' bike' + (item.remainingBikes > 1 ? 's' : '') +  ' available at the station ' + item.name + ', ' + item.street + ', ' + item.zip + ' ' + item.city + '.</p>',
						icon: {
							type: 'awesomeMarker',
							prefix: 'fa',
							markerColor: defineColor(item.remainingBikes),
							icon: 'bicycle'
						}
					});
				});
			});
	}

	$interval(fn, 5000);

	fn();
}]);

app.controller('CitizenMapController', ['$scope', '$interval', 'leafletData', 'DataServiceFactory', function($scope, $interval, leafletData, dataService) {
	$scope.mapMarkers = [];
	$scope.issues = [];

	$scope.defaults = defaults;

	$scope.mapCenter = {
		lat: 46.77518,
		lng: 6.6369435,
		zoom: 14
	};

	var fn = function() {
		dataService
			.getData('citizen')
			.then(function(issues) {
				_.each(issues, function(issue) {
					var idx = _.findIndex($scope.issues, { id: issue.id });

					if (idx > -1) {
						$scope.issues[idx] = issue;
					}
					else {
						$scope.issues.push(issue);
					}
				});

				$scope.mapMarkers = _.map($scope.issues, function(issue) {
					return {
						lat: issue.lat,
						lng: issue.lng,
						compileMessage: true,
						message: '<p>' + issue.description + '</p>' + (issue.imageUrl ? '<p><img src="'+ issue.imageUrl + '" width="200px" /></p>' : '') + '<p><strong>By ' + issue.owner + ' at ' + issue.createdOn + '</strong></p>',
						icon: {
							type: "awesomeMarker",
							markerColor: changeStateActions[issue.state],
							icon: 'wrench'
						}
					}
				});
			});
	};

	$interval(fn, 5000);

	fn();
}]);