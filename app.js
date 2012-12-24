var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var flash = require('connect-flash');

var registry = require('./registry');
var routes = require('./routes');

// Configuration
var app = module.exports = express();
app.configure(function() {
    app.set('port', process.env.npm_package_config_port || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('not very secret, should put in config?'));
    app.use(express.session());
    app.use(stylus.middleware({
        src: __dirname + '/public',
        compile: function stylus_compile(str, path) {
            return stylus(str)
                .set('filename', path)
                // TODO: it would be nice to turn off compress only on dev mode
                .set('compress', true)
                .set('force', true)
                .use(nib())
                .import('nib');
        }
    }));
    app.use(flash());
    app.use(function(req, res, next) {
        res.locals.flash = req.flash.bind(req);
        next();
    });
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.set('view options', {
        layout: false,
        pretty: true
    });

    registry.on('update', function() {
        console.log('registry updated:');
        console.dir(registry);
    });
});

app.configure('production', function() {
    app.use(express.errorHandler());
    app.set('view options', {
        layout: false,
        pretty: false
    });
});

// Routes

app.get('/', routes.index);
app.get('/:project', routes.project);
app.post('/:project', routes.project_ctl);

// Start

app.listen(app.get('port'), process.env.npm_package_config_address, function() {
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
