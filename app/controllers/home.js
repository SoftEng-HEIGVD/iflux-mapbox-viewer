var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

function isPage(referencePage) {
	return function(page) {
		if (page == referencePage) {
			return 'active';
		}
		else {
			return null;
		}
	}
}

router.get('/', function (req, res, next) {
	res.render('index', { isPage: isPage('home') });
});

router.get('/publibike', function (req, res, next) {
	res.render('publibike', { isPage: isPage('publibike') });
});

router.get('/citizen', function (req, res, next) {
	res.render('citizen', { isPage: isPage('citizen') });
});

router.get('/archi', function (req, res, next) {
	res.render('architecture', { isPage: isPage('archi') });
});
