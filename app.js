var express = require('express');
var app = module.exports = express.createServer();

var registry = require('./registry');

// Configuration
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'not very secret, should put in config?'
    }));
    app.use(require('stylus').middleware({
        src: __dirname + '/public'
    }));
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

var routes = require('./routes');
app.get('/', routes.index);

// Start

app.listen(process.env.npm_package_config_port, process.env.npm_package_config_address, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
