const fs = require('fs');
const p = require('./promisify');
const path = require('path')
const request = require('request-promise-native');
const defaults = require('../template.json')

function isURL(str) {
    return typeof str === 'string' && str.lastIndexOf('http') >= 0;
}

const readFile = p(fs.readFile)
const writeFile = p(fs.writeFile)

module.exports = function (name, url, config) {
    return writeToConfig(name, url, config)
        .then(conf => {
            if (!conf.uuid && conf.startup_app) {
                if (conf.startup_app.uuid) {
                    conf.uuid = conf.startup_app.uuid + '-runtime';
                } else {
                    config.uuid = 'cli' + '-' + 'runtime' + Math.random().toString(36).substring(2);
                }
            } return conf
        })
}


function writeToConfig(name, url, config) {

    if (isURL(config)) {
        return request(config).then(body => JSON.parse(body))
    }

    const shortcut = {};
    const startup_app = {};
    if (name) {
        startup_app.name = name;
        shortcut.name = name;
        shortcut.company = name;
        shortcut.description = name;
    } if (url) {
        startup_app.url = url;
    }
    
    const updates = {
        startup_app: startup_app,
        shortcut: shortcut
    };

    return readFile(config)
        .then(conf => write(name, JSON.parse(conf),updates,'Updating Config'))
        .catch(err => {
            if(err.code === 'ENOENT') {
                return write(name, {}, updates, 'Creating Config')
            } else if (!config) {
                return write(undefined, {}, updates)
            } else {
                throw err
            }
        });
}

function write (location,base,updates,message) {
    const config = merge(defaults, base, updates)
    if (config.startup_app && !config.startup_app.uuid) {
        config.startup_app.uuid = config.startup_app.name + '-' + Math.random().toString(36).substring(2);
    }
    if (!location) {
        return config
    }
    const loc = path.resolve(location)
    return writeFile(loc, JSON.stringify(config, null, '    '))
        .then(() => {
            console.log(message, loc)
            return config
        })   
}

function merge(one = {}, two, ...rest) {
    if (rest.length > 0) {
        const [head, ...tail] = rest;
        return merge(merge(one, two), head, ...tail)
    } 
    Object.keys(two).forEach( key => {
        if (typeof two[key] !== 'object') {
            one[key] = two[key];
        } else {
            one[key] = merge(one[key], two[key])
        }
    })
    return one
}