var registry = require('../registry');

exports.index = function(req, res) {
    debugger;
    res.render('index', {
        title: 'Umbrella 9',
        registry: registry,
    });
};