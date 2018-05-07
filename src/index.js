'use strict';
const { launch, Identity } = require('hadouken-js-adapter');
const writeToConfig = require('./write-config')
const path = require('path');
const fs = require('fs');
const request = require('request');
const parseURLOrFile = require('./parse-url-or-file');

function main(cli) {
    const flags = cli.flags;
    const { name, url, config, launch } = flags;
    const parsedUrl = url ? parseURLOrFile(url) : url;

    if (isEmpty(flags)) {
        cli.showHelp();
        return;
    }

    console.log(flags)

    writeToConfig(name, parsedUrl, config)
        .then(function(manifestUrl) {
            const configObj = { manifestUrl }
            if (launch) {
                launchOpenfin(configObj)
                    .then(p => console.log(`OpenFin running on port ${p}`))
                    // .then(fin => fin.Application.create(configObj.startup_app))
                    // .then(a => a.run())
                    .then(() => process.exit(0))
                    .catch(e => console.error('Failed launch', e));
            }

            if (configObj) {
                fetchInstaller(flags, configObj);
            }
        }).catch((err) => {
            onError('Failed:', err);
        });
}

function fetchInstaller(flags, configObj) {
    const hyperlink = flags.h || flags.hyperlink;
    const destination = flags.d || flags.destination;
    const appName = configObj.startup_app ? configObj.startup_app.name : null;
    const name = flags.n || flags.name || appName || 'openfin';
    const openfinInstaller = require('openfin-installer')(configObj);
    const fetchOptions = {
        noExt: flags.noExt || null,
        rvmConfig: flags.rvmConfig || null,
        supportEmail: flags.supportEmail || null,
        dnl: flags.dnl || null,
        destination: flags.d || flags.destination,
        config: flags.c || null,
        name: name
    };

    if (destination) {
        openfinInstaller.fetchInstaller(fetchOptions).then(
            function() {
                console.log('Installer zip written to', destination);
            },
            function(reason) {
                console.log(reason);
            }
        );
    }

    if (hyperlink) {
        console.log(
            '\n',
            openfinInstaller.generateInstallUrl(
                encodeURIComponent(name),
                fetchOptions.config,
                fetchOptions.noExt,
                fetchOptions.rvmConfig,
                fetchOptions.supportEmail,
                fetchOptions.dnl
            ),
            '\n'
        );
    }
}



//makeshift is object empty function
function isEmpty(flags) {
    for (let key in flags) {
        if (flags.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function onError(message, err) {
    console.log(message, err);
}

//will launch download the rvm and launch openfin
function launchOpenfin(config) {
    return launch(config);
}



module.exports = main;
