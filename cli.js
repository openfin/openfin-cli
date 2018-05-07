#!/usr/bin/env node

'use strict';
const meow = require('meow'),
    openfinCli = require('./src');

const options = {
    flags: {
        name: { alias: 'n', type: 'string' },
        url: { alias: 'u', type: 'string' },
        config: { alias: 'c', type: 'string' },
        launch: { alias: 'l', type: 'boolean' }
    }
};

const cli = meow(
    `
        OpenFin cli is capable of launching Application, and creating OpenFin config files.
        Options:
        -c --config <config file>
        -n --name <application name to be used in the config>
        -u --url <application url>
        -l --launch launch this configuration

        -i --installer a url to an OpenFin config file 
        -h --hyperlink return a url to stdout pointing to the OpenFin installer webservice
        -d --destination write the results of -i to disk using this path


        --file-name <application name to be used in the config>
        --no-ext <If set “true”, the file is extention-less>
        --rvm-config <URL that points to the RVM config. Must be a full URL.>
        --support-email <The email address to display in the installer when an error occurs. Default value = "support@openfin.co">
        --dnl <Installs an application without launching it. Set value to true [dnl=true]>

        --version current version of the tool
        Example
          openfin -l -c myconfig.json -u http://www.openfin.co
    `,
    options
);
openfinCli(cli);
