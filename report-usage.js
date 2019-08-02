'use strict';
var os = require('os'),
    mid = require('node-machine-id'),
    https = require('https'),
    querystring = require('querystring');

module.exports = function(status, config, configObj) {
    var reportURL = 'https://install.openfin.co/installer-usage?';
    var queryObj = {
        appName: configObj.startup_app.name || 'TMP',
        appLocation: __dirname,
        version: configObj.runtime.version || 'undefined',
        machineId: mid.machineIdSync({original: true}).toUpperCase(),
        manifestUrl: config,
        platform: os.platform().concat('-', os.release()),
        licenseKey: configObj.licenseKey || "contract_identifier",
        launchMethod: 'openfin-cli',
        launchStatus : status || 'SUCCESS'
    }

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
