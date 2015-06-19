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

  	console.log('Received %s actions on REST API.', actions.length);

		_.each(actions, function(action) {
			if (action.type === config.viewbox.actionType) {
				actionService.store(action);
			}
		});

		res.status(204).send();
	});