var express = require('express');
var glob = require('glob');

var
	path = require('path'),
	stylus = require('stylus'),
	nib = require('nib');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');

module.exports = function(app, config) {
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

	app.use(function(req, res, next) {
		var contextRoot = req.headers['x-context-root'];

		if (contextRoot) {
			if (contextRoot.indexOf('/', contextRoot.length - 1) !== -1) {
				contextRoot = contextRoot.substr(0, contextRoot.length - 2);
			}

			if (contextRoot.indexOf('/') === 0) {
				app.locals.contextRoot = contextRoot;
			}
			else {
				app.locals.contextRoot = '/' + contextRoot;
			}
		}
		else {
			app.locals.contextRoot = '';
		}

		next();
	});

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());

	app.use(stylus.middleware({
	  src: path.join(__dirname, '../app/assets'),
	  dest: path.join(__dirname, '../public'),
	  debug: true,
	  force: true,
    compile: function(str, path) { // optional, but recommended
	    console.log('there');
      return stylus(str)
	      .set('filename', path)
	      .set('compress', true)
	      .use(nib());
    }
  }));

	app.use(express.static(config.root + '/public'));

  app.use(methodOverride());

	var resources = glob.sync(config.root + '/app/resources/*.js');
	resources.forEach(function (resource) {
	 require(resource)(app);
	});

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
