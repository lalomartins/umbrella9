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

    if(project.child !== null)
        return res.redirect('http://localhost:' + project.port);

    res.render('project', {
        title: project.name,
        project: project,
        url: req.url,
    });
};

exports.project_ctl = function(req, res) {
    var project = registry.projects[req.params.project];
    var action = req.body.action;

    switch (action) {
    case 'start':
        if(project.child !== null) {
            req.flash('error', 'Project already running!');
            break;
        }
        project.start();
        break;

    case 'stop':
        if(project.child === null) {
            req.flash('error', 'Project isn\'t running!');
            break;
        }
        project.stop();
        break;

    default:
        req.flash('error', 'Unknown action "' + action + '"');
    }

    return res.redirect(req.url);
};
