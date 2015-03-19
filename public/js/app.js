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
	acknowledged: 'cadetblue',
	in_progress: 'purple',
	rejected: 'red',
	resolved: 'green'
};

var issueTypeCodes = {
	bsl: 'lightbulb-o',
	dcr: 'road',
	grf: 'asterisk'
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

	$scope.legend = {
		position: 'bottomleft',
		colors: [ '#7BB128', '#E47E2D', '#D94835' ],
		labels: [ '3 bikes or more', 'Less than 3 bikes', 'No more bike' ]
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
		zoom: 15
	};

	$scope.legend = {
		position: 'bottomleft',
		colors: [ '#E47E2D', '#329ACA', '#3D6471', '#C94EB1', '#D94835', '#7BB128' ],
		labels: [ 'Created issues', 'Assigned issues', 'Acknowledged issues', 'In progress issues', 'Rejected issues', 'Resolved issues']
	};

	var fn = function() {
		dataService
			.getData('citizen')
			.then(function(issues) {
				$scope.issues = issues;

				$scope.mapMarkers = _.map($scope.issues, function(issue) {
					return {
						lat: issue.lat,
						lng: issue.lng,
						compileMessage: true,
						message: '<p>' + issue.description + '</p>' + (issue.imageUrl ? '<p><img src="'+ issue.imageUrl + '" width="200px" /></p>' : '') + '<p><strong>By ' + issue.owner + ' at ' + issue.createdOn + '</strong></p>',
						icon: {
							type: "awesomeMarker",
							prefix: 'fa',
							markerColor: changeStateActions[issue.state],
							icon: issueTypeCodes[issue.issueTypeCode]
						}
					}
				});
			});
	};

	$interval(fn, 5000);

	fn();
}]);