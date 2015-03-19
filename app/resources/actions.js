var
	_ = require('underscore'),
	express = require('express'),
	router = express.Router(),
	actionService = require('../services/actionService');

module.exports = function (app) {
  app.use('/actions', router);
};

router.route('/')
	/* POST actions */
	.post(function (req, res) {
  	var actions = req.body;

  	console.log("Received " + actions.length + " actions on REST API.");

		_.each(actions, function(action) {
			console.log("Action: " + action.type);

			if (action.type === "newMarker") {
				actionService.store(action);
			}
			else if (action.type === "updateMarker") {
				console.log("Update received");
				actionService.update(action);
			}
		});

		res.status(204).send();
	});