'use strict';
var os = require('os'),
    mid = require('node-machine-id'),
    https = require('https');

// Get Manifest URL
var url = [
    'https://install.openfin.co/installer-usage?',
    'appName=',
    'TMP',
    '&appLocation=',
    'NULL',
    '&version=',
    'undefined',
    '&machineId=',
    'NULL',
    '&manifestUrl=',
    'NULL',
    '&platform=',
    'OSX',
    '&licenseKey=',
    'contract_identifier',
    '&launcherStatus=',
    'SUCCESS'
    ],
    appName = 2,
    appLocation = 4,
    version = 6,
    machineId = 8,
    manifestUrl = 10,
    platform = 12,
    licenseKey = 14,
    launcherStatus = 16;

module.exports = function(status, config, configObj) {
    var configuredUrl = url.slice(0);
    configuredUrl[appName] = encodeURIComponent(configObj.startup_app.name || 'TMP');
    configuredUrl[appLocation] = encodeURIComponent(__dirname);
    configuredUrl[version] = configObj.runtime.version || 'undefined';
    configuredUrl[machineId] = mid.machineIdSync({original: true}).toUpperCase();
    configuredUrl[manifestUrl] = encodeURIComponent(config);
    configuredUrl[platform] = os.platform().concat('-', os.release());
    configuredUrl[licenseKey] = configObj.licenseKey || "contract_identifier";
    configuredUrl[launcherStatus] = status || 'SUCCESS';

    https.get(configuredUrl.join(''), (resp) => {
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
