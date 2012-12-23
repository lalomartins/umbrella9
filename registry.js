var fs = require('fs');
var util = require('util');
var path = require('path');
var child_process = require('child_process');
var events = require('events');
var mkdirp = require('mkdirp');
var httpProxy = require('http-proxy');

const executable = process.env.npm_package_config_cloud9_executable || 'cloud9';

function Registry() {
    Registry.super_.call(this);
    this.projects = {};
}
util.inherits(Registry, events.EventEmitter);

var registry = module.exports = new Registry();

function Project(name, json) {
    this.name = name;
    this.port = json.port;
    this.root = json.root;
    this.child = null;
    // WARNING if you change the port by assignment, you have to also fix the proxy
    this.proxy = new httpProxy.HttpProxy({
        target: {
            host: 'localhost',
            port: this.port
        }
    });
    this.proxy.on('proxyError', function(err, req, res) {
        // do pretty much the same thing as http_proxy, but sending headers isn't really safe at this point
        try {
            res.writeHead(502, {'Content-Type': 'text/plain'});
        }
        catch (ex) {
        }
        if(process.env.NODE_ENV === 'production') {
            res.write('Proxy Error');
        }
        else {
            res.write('An error has occurred: ' + JSON.stringify(err));
        }
        try {
            res.end();
        }
        catch (ex) {
            console.error("res.end error: %s", ex.message);
        }
        return true;
    });
}
util.inherits(Project, events.EventEmitter);

Project.prototype.toJSON = function toJSON() {
    return {
        port: this.port,
        root: this.root
    };
};

Project.prototype.start = function start() {
    this.child = child_process.spawn(executable, ['-p', this.port, '-w', this.root]);
    this.child.on('exit', this.stopped.bind(this));
};

Project.prototype.stop = function start() {
    if(this.child) {
        this.child.kill();
    }
};

Project.prototype.stopped = function stopped(exit_code) {
    console.log('process ' + this.name + ' stopped: ' + exit_code);
    this.child = null;
};



Registry.prototype.update = function update(error, data) {
    if(error) {
        console.error("Failed to update registry:");
        console.error(error);
        return;
    }

    if(this._just_saved) {
        // there could be a race condition here, but I don't think I care
        // (the fix would be to lock the file, I suppose)
        this._just_saved = false;
        return;
    }

    try {
        data = JSON.parse(data);
    } catch(error) {
        console.error("Failed to update registry (parse error):");
        console.error(error);
        return;
    }

    var started_ports = {};
    var started_roots = {};
    for(var key in this.projects) {
        var project = this.projects[key];
        if(project.child !== null) {
            started_ports[project.port] = project;
            started_roots[project.root] = project;
        }
    }

    for(key in data.projects) {
        var project = this.projects[key] = new Project(key, data.projects[key]);
        if(started_ports[project.port] !== undefined &&
           started_roots[project.root] !== undefined &&
           started_ports[project.port].child.pid == started_roots[project.root].child.pid) {
            if(project.name === started_ports[project.port].name)
                project = this.projects[key] = started_ports[project.port];
            else
                project.child = started_ports[project.port].child;
            delete started_ports[project.port];
            delete started_roots[project.root];
        }
    }

    // TODO: stop removed/changed projects (maybe restart?)

    this.emit('update');
};

Registry.prototype.save = function save(callback) {
    // there could be a race condition here, but I don't think I care
    // (the fix would be to lock the file, I suppose)
    this._just_saved = true;
    fs.writeFile(registry.filename,
    JSON.stringify({
        projects: this.projects,
    }, null, 4),
    'utf-8', callback);
};

registry.filename = process.env.HOME + '/.config/umbrella9/registry.json';
console.log('creating ' + path.dirname(registry.filename));
mkdirp(path.dirname(registry.filename), function(err) {
    if(err) {
        console.error("Couldn't create configuration:");
        console.error(err);
        process.exit(1);
    }

    fs.exists(registry.filename, function(exists) {
        function done(err, data) {
            if(err) {
                console.error("Failed to initialize configuration:")
                console.error(err);
                process.exit(1);
            }

            if(data)
                registry.update(null, data);
            else
                registry._just_saved = false;

            fs.watch(registry.filename, function(what, filename) {
                console.log('registry ' + what);
                fs.readFile(registry.filename, 'utf-8', registry.update.bind(registry));
            });
        }
        if(exists) {
            fs.readFile(registry.filename, 'utf-8', done);
        } else {
            // Initial run. Let's set it up with Umbrella9 (if it's a source checkout) or empty.
            if(fs.existsSync(__dirname + '/.bzr') || fs.existsSync(__dirname + '/.git'))
                registry.projects.umbrella9 = new Project('umbrella9', {port: Number(process.env.npm_package_config_port) + 1, root: __dirname});
            registry.save(done);
        }
    });
});
