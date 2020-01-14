#!/usr/bin/env node
'use strict';
const meow = require('meow');
const openfinCli = require('./');

const options = {
    flags: {
        name: { alias: 'n', type: 'string' },
        url: { alias: 'u', type: 'string' },
        config: { alias: 'c', type: 'string' },
        launch: { alias: 'l', type: 'boolean' },
        devtoolsPort: { alias: 'p', type: 'integer' },
        runtime: { alias: 'r', type: 'string' }
    }
};

const cli = meow({
    help: [
        'OpenFin cli is capable of launching Application, and creating OpenFin config files.',
        'Options:',
        '-c --config <config file>',
        '-u --url <application url>',
        '-l --launch launch this configuration',
        '-p --devtools-port devtools port number',
        '-r --runtime-version runtime version',
        '--version current version of the tool',
        'Example',
        '  openfin -l -c myconfig.json -u http://www.openfin.co'
    ].join('\n')
});

openfinCli(cli);
