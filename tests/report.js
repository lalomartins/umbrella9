#! /usr/bin/env node

var fs = require('fs');

// run this with “cucumber.js --format json tests | tests/report.js”
// (or “npm run-script bdd”)

var input = '';

process.stdin.resume();
process.stdin.on('data', function(buf) {
    input += buf.toString();
});

process.stdin.on('end', function() {
    input = input.split('\n');
    for(var i = 0; i < input.length; i++)
        if(input[i].charAt(0) == '[') break;
    if(i == input.length) {
        console.error('invalid input');
        process.exit(1);
    }
    input = input.slice(i).join('\n');
    var data = JSON.parse(input);

    var results = {
        passed: [],
        failed: [],
        skipped: [],
        pending: [],
        undefined: [],
        unknown: {},
    };
    var scenarios = {
        failed: [],
        skipped: [],
        pending: [],
        undefined: [],
    };
    data.forEach(function(feature) {
        feature.elements.forEach(function(scenario) {
            if(scenario.steps === undefined) return;
            var any_failed = {};
            scenario.steps.forEach(function(step) {
                if(step.result === undefined) return;
                if(step.result.status in results) {
                    results[step.result.status].push([feature.name, scenario.name, step.name, step.result]);
                    if(step.result.status in scenarios)
                        any_failed[step.result.status] = true;
                } else {
                    if(!(step.result.status in results.unknown))
                        results.unknown[step.result.status] = [];
                    results.unknown[step.result.status].push([feature.name, scenario.name, step.name, step.result]);
                }
            });
            for(var key in any_failed)
                scenarios[key].push([feature.name, scenario.name]);
        });
    });

    console.log('\n\n\n\n\n');

    if(Object.keys(results.unknown).length) {
        console.log('There were ' + Object.keys(results.unknown).length + ' unknown results, you might need to fix the report script:');
        for(var key in results.unknown) {
            console.log('status: ' + key);
            results.unknown[key].forEach(function(step) {
                console.log('    ' + step.slice(0, 3).join(' → '));
            });
        }
    } else if(results.undefined.length) {
        console.log(results.undefined.length + ' steps are undefined over ' + scenarios.pending.length + ' scenarios! Better write them post-haste...');
        results.undefined.forEach(function(step) {
            console.log('    ' + step.slice(0, 3).join(' → '));
        });
    } else if(results.failed.length == 0 && results.skipped.length == 0 && results.pending.length == 0) {
        console.log('Oh my goodness, would you look at that, all tests passed!');
    } else if(results.failed.length) {
        console.log(results.failed.length + ' steps have failed over ' + scenarios.failed.length + ' scenarios :-(');
        results.failed.forEach(function(step) {
            console.log('\n\n    ' + step.slice(0, 3).join(' → '));
            console.log('      ' + step[3].error_message);
        });
    } else if(results.pending.length) {
        console.log(results.pending.length + ' steps are still pending over ' + scenarios.pending.length + ' scenarios; keep going!');
        results.pending.forEach(function(step) {
            console.log('    ' + step.slice(0, 3).join(' → '));
        });
    } else if(results.skipped.length) {
        console.log(results.skipped.length + ' steps were skipped over ' + scenarios.skipped.length + ' scenarios; that is weird, you should investigate!');
        results.skipped.forEach(function(step) {
            console.log('    ' + step.slice(0, 3).join(' → '));
            console.dir(step[3]);
        });
    }
});
