'use strict';
var configBuilder = require('openfin-config-builder'),
    { launch, connect } = require('hadouken-js-adapter'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    parseURLOrFile = require('./parse-url-or-file'),
    reportUsage = require('./report-usage'),
    meow;

function main(cli) {
    meow = cli;

    var flags = cli.flags,
        name = flags.n || flags.name,
        url = flags.u || flags.url,
        config = flags.c || flags.config || 'app.json',
        launch = flags.l || flags.launch,
        devtools_port = flags.p || flags.devtoolsPort,
        runtime_version = flags.v || flags.runtimeVersion,
        parsedUrl = url ? parseURLOrFile(url) : url;

    if (isEmpty(flags)) {
        console.log(cli.help);
        return;
    }

    try {
        writeToConfig(name, parsedUrl, config, devtools_port, runtime_version, function (configObj) {
            if (launch) launchOpenfin(config, configObj);
        });
    } catch (err) {
        onError('Failed:', err);
    }
}

function isURL(str) {
    return (typeof str === 'string') && str.lastIndexOf('http') >= 0;
}

//makeshift is object empty function
function isEmpty(flags) {
    for (var key in flags) {
        if (flags.hasOwnProperty(key) && flags[key] !== false) {
            return false;
        }
    }
    return true;
}

function onError(message, err) {
    console.log(message, err);
    console.log(meow.help);
}

//will launch download the rvm and launch openfin
async function launchOpenfin(config, configObj) {
    reportUsage('START', config, configObj);
    try {
        const manifestUrl = isURL(config) ? config : path.resolve(config);
        const port = await launch({ manifestUrl, installerUI: true });
        const fin = await connect({
            uuid: 'openfin-cli-server-connection',
            address: `ws://localhost:${port}`,
            nonPersistent: true,
        });

        fin.once('disconnected', process.exit);
    } catch (err) {
        reportUsage(err.toString(), config, configObj);
        console.error(err);
    }
}

//write the specified config to disk.
function writeToConfig(name, url, config, devtools_port, runtime_version, callback) {
    if (isURL(config)) {
        request(config, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                callback(JSON.parse(body));
            }
        });
        return;
    }

    var shortcut = {},
        startup_app = {},
        runtime = {},
        configAction,
        actionMessage;

    fs.exists(config, function (exists) {
        if (exists) {
            configAction = configBuilder.update;
            actionMessage = 'using config';
        } else {
            configAction = configBuilder.create;
            actionMessage = 'successfully created config';
        }
        if (config) {
            if (name) {
                startup_app.name = name;
                shortcut.name = name;
                shortcut.company = name;
                shortcut.description = name;
            }
            if (url) {
                startup_app.url = url;
            }

            if (runtime_version) {
                runtime.version = runtime_version;
            }
        }

        var appConfigObj = {
            startup_app: url ? startup_app : null,
            shortcut: shortcut
        };

        if (devtools_port) {
            appConfigObj.devtools_port = devtools_port;
        }

        if (runtime_version) {
            appConfigObj.runtime = runtime;
        }

        //create or update the config
        configAction(appConfigObj, config).catch(function (err) {
            console.log(err);
        }).then(function (configObj) {
            console.log(actionMessage, path.resolve(config));
            callback(configObj);
        });
    });
}


module.exports = main;
