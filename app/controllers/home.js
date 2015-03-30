var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

function extractPage(req, res, next) {
	var path = req._parsedUrl.path.split('/');

	req.app.locals.page = path[1];

	next();
}

router.route('/')
	.get(extractPage)
	.get(function (req, res, next) {
		res.render('index');
	});

router.route('/publibike')
	.get(extractPage)
	.get(function (req, res, next) {
		res.render('publibike');
	});

router.route('/citizen')
	.get(extractPage)
	.get(function (req, res, next) {
		res.render('citizen');
	});

router.route('/archi')
	.get(extractPage)
	.get(function (req, res, next) {
		res.render('architecture');
	});
