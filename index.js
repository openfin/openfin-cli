'use strict';
const { launch, connect } = require('hadouken-js-adapter');
const path = require('path');
const fs = require('fs');
const reportUsage = require('./report-usage');
const { getUuid, fetch, isURL } = require('./utils');
const os = require('os');

const main = async (cli) => {
    const meow = cli;
    const flags = cli.flags;
    const url = flags.u || flags.url;
    const launch = flags.l || flags.launch;
    const devtoolsPort = flags.p || flags.devtoolsPort || null;
    const runtime = flags.r || flags.runtime;
    const isPlatform = flags.t || flags.platform;
    let manifestUrl = flags.c || flags.config || null;
    let buildConfig;
    let configObj;

    if (isEmpty(flags)) {
        console.log(meow.help);
        return;
    }

    try {
        if (url) {
            buildConfig = true;
            const manifestInfo = await writeManifest(url, devtoolsPort, runtime, isPlatform);
            manifestUrl = manifestInfo.filepath;
            configObj = manifestInfo.manifest;
        }

        if (launch) {
            if (!buildConfig) {
                if (isURL(manifestUrl)) {
                    const config = await fetch(manifestUrl);
                    configObj = JSON.parse(config);
                } else {
                    manifestUrl = path.resolve(manifestUrl);
                    const config = fs.readFileSync(manifestUrl);
                    configObj = JSON.parse(config);
                }
            }

            reportUsage('START', manifestUrl, configObj);
            launchOpenfin(manifestUrl);
        }
    }
    catch (error) {
        console.log(`Failed: ${error}`);
        console.log(meow.help);
    }
}

//makeshift is object empty function
const isEmpty = (flags) => {
    for (var key in flags) {
        if (flags.hasOwnProperty(key) && flags[key] !== false) {
            return false;
        }
    }
    return true;
}

//will launch download the rvm and launch openfin
const launchOpenfin = async (manifestUrl) => {
    try {
        const port = await launch({ manifestUrl, installerUI: true });
        const fin = await connect({
            uuid: `adapter-connection-${getUuid()}`,
            address: `ws://localhost:${port}`,
            nonPersistent: true,
        });

        fin.once('disconnected', process.exit);
    } catch (err) {
        reportUsage(err.toString(), config, configObj);
        console.error(err);
    }
}

function writeManifest(url, devtoolsPort, runtime, isPlatform) {
    return new Promise((resolve, reject) => {
        const uuid = `app-${getUuid()}`;
        const devtools_port = devtoolsPort ? devtoolsPort : 9090;
        const version = runtime ? runtime : "stable"
        const parsedUrls = url.split(',');
        let manifest;

        const generateViewObj = () => ({
            type: "component",
            componentName: "view",
            componentState: {
                name: `view-${getUuid()}`,
                url: ''
            }
        });

        const buildContent = () => {
            const content = [];
            parsedUrls.forEach((url) => {
                const viewObj = generateViewObj();
                viewObj.componentState.url = url;
                content.push(viewObj);
            });

            return content;
        }

        if (isPlatform) {
            const content = buildContent();

            manifest = {
                runtime: {
                    version
                },
                platform: {
                    uuid,
                    autoShow: false
                },
                snapshot: {
                    windows: [
                        {
                            saveWindowState: false,
                            backgroundThrottling: true,
                            layout: {
                                content: [
                                    {
                                        type: 'row',
                                        id: 'no-drop-target',
                                        content
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        } else {
            manifest = {
                devtools_port,
                startup_app: {
                    name: uuid,
                    url: parsedUrls[0],
                    uuid,
                    saveWindowState: false,
                    autoShow: true
                },
                runtime: {
                    version
                }
            }
        }





        const manifestJson = JSON.stringify(manifest);
        const filepath = path.join(os.tmpdir(), `${uuid}.json`);

        fs.writeFile(filepath, manifestJson, (error) => {
            if (error) {
                reject(error);
            } else {
                console.info(`Manifest written to: ${path.resolve(filepath)}`);
                resolve({ filepath, manifest });
            }
        });
    });
}

module.exports = main;
