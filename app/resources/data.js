var
	_ = require('underscore'),
	express = require('express'),
	router = express.Router(),
	actionService = require('../services/actionService');

module.exports = function (app) {
  app.use('/data', router);
};

router.route('/:collection')
	.get(function (req, res) {
		res.status(200).json(actionService.getCollection(req.params.collection)).end();
	});