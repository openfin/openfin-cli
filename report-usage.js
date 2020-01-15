'use strict';
const https = require('https');
const mid = require('node-machine-id');
const os = require('os');
const querystring = require('querystring');

const getAppName = (configObj) => {
    if (configObj.startup_app) {
        return configObj.startup_app.name || configObj.startup_app.uuid;
    } else if (configObj.platform) {
        return configObj.platform.name || configObj.platform.uuid;
    }
    return 'no-app-name-or-uuid';
};

module.exports = function(status, config, configObj) {
    if (process.platform === 'win32')
        return;

    var reportURL = 'https://install.openfin.co/installer-usage?';
    var queryObj = {
        appName: getAppName(configObj),
        appLocation: __dirname,
        version: configObj.runtime.version || 'undefined',
        machineId: mid.machineIdSync({original: true}).toUpperCase(),
        manifestUrl: config,
        platform: os.platform().concat('-', os.release()),
        licenseKey: configObj.licenseKey || "contract_identifier",
        launchMethod: 'openfin-cli',
        launchStatus : status || 'SUCCESS'
    };

    https.get(reportURL.concat(querystring.stringify(queryObj)), (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            console.log('report usage data: ', data);
        });
    }).on("error", (err) => {
        console.log("report usage data error: " + err.message);
    });
};
