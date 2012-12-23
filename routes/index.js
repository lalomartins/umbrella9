var registry = require('../registry');

exports.index = function(req, res) {
    res.render('index', {
        title: 'Umbrella 9',
        registry: registry,
    });
};

exports.project = function(req, res, next) {
    var project = registry.projects[req.params.project];
    if(project === undefined)
        return next();

    res.render('project', {
        title: project.name,
        project: project,
    });
};