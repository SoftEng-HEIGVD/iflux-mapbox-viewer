var
	_ = require('underscore'),
	express = require('express'),
	router = express.Router(),
	config = require('../../config/config'),
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
			console.log("Action: %s", action.type);

			if (action.type === config.viewbox.actionType) {
				console.log("type matched");
				actionService.store(action);
			}
		});

		res.status(204).send();
	});