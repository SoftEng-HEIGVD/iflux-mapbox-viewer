var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
	res.render('index', {});
});

router.get('/publibike', function (req, res, next) {
	res.render('publibike', {});
});

router.get('/citizen', function (req, res, next) {
	res.render('citizen', {});
});
