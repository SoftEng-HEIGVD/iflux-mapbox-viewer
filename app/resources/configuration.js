var
	_ = require('underscore'),
	express = require('express'),
	router = express.Router(),
	config = require('../../config/config'),
	viewConfigService = require('../services/viewConfigService');

module.exports = function (app) {
  app.use('/configure', router);
};

router.route('/')
	.post(function (req, res) {
		if (req.body.actionTargetId) {
			viewConfigService.upsert(req.body.actionTargetId, req.body.properties);
		}

		return res.status(204).end();
	});
