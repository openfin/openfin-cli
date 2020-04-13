# OpenFin Runtime cli tool

[![Build Status](https://travis-ci.org/openfin/openfin-cli.svg?branch=master)](https://travis-ci.org/openfin/openfin-cli)

The OpenFin Cli tool will allow you to launch the OpenFin runtime given a url or a configuration file, it will also allow you to create configuration files by giving only name and url.

## Dependencies

You will need [Node.js](http://nodejs.org/) to use the tool and creating configs will work cross platform, but launching the OpenFin runtime is restricted to Windows at the moment.

## Install

```sh
$ npm install -g openfin-cli
```


## Usage

```sh
$ openfin --help
```

## Examples

#### Launching OpenFin Demos
```
$ openfin --launch --config http://cdn.openfin.co/demos/hyperblotter/app.json
$ openfin --launch --config https://demoappdirectory.openf.in/desktop/config/apps/OpenFin/HelloOpenFin/app.json
```

#### Launching an application

```sh
$ openfin --launch --url http://www.openfin.co
```

Shorthand
```sh
$ openfin -l -u http://www.openfin.co
```

#### Launch application and save manifest to the working directory

```sh
$ openfin --launch --url http://www.openfin.co --save myconfig.json
```

Shorthand
```sh
$ openfin -l -u http://www.openfin.co -s myconfig.json
```


#### Launching a given config file

```sh
$ openfin --launch --config myconfig.json
$ openfin --launch --config http://goo.gl/w2747v
```

Shorthand
```sh
$ openfin -l -c myconfig.json
$ openfin -l -c http://goo.gl/w2747v
```

#### Launching URLs into an OpenFin Platform
```
$ openfin --launch --platform --url https://openfin.co,http://cdn.openfin.co/demos/hyperblotter/index.html,https://google.com
```

```
## License

Apache 2.0

The code in this repository is covered by the included license.

However, if you run this code, it may call on the OpenFin RVM or OpenFin Runtime, which are covered by OpenFin’s Developer, Community, and Enterprise licenses. You can learn more about OpenFin licensing at the links listed below or just email us at support@openfin.co with questions.

https://openfin.co/developer-agreement/ <br/>
https://openfin.co/licensing/

[npm-url]: https://npmjs.org/package/openfin-cli
[npm-image]: https://badge.fury.io/js/openfin-cli.svg
[travis-url]: https://travis-ci.org/rdepena/openfin-cli
[travis-image]: https://travis-ci.org/rdepena/openfin-cli.svg?branch=master
[daviddm-url]: https://david-dm.org/rdepena/openfin-cli.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/rdepena/openfin-cli
