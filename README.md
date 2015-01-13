# AMD extension for NCE
## Description
This is an nce extension for [Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki/AMD) support designed with [require.js](http://requirejs.org/docs/whyamd.html).  

## How to install
Install with npm: `npm install --save nce-amd`

Integrate in NCE with the [extension-manager](https://www.npmjs.com/package/nce-extension-manager):

```
var NCE = require("nce");
var nce = new NCE(/*{}*/);
var extMgr = require("nce-extension-manager")(nce);

var amd = extMgr.getActivatedExtension("amd");
```

## How to use
### Config settings
You are able to use the following [config-settings](https://github.com/atd-schubert/node-nce/wiki/Extension-Class#configuration) with their defaults:

    * `route: "/amd"`: Sub-URL to listen
    * `dumpPath: process.cwd() + "/amd"`: Directory to dump files
    * `logger: {}`: Settings for [logger-extension](https://github.com/atd-schubert/nce-winston)

### Basic methods
#### ext.define(name, code, cb, opts)
Define a module for amd.

Normally the code get minified. If you don't want to, set: `opts.minify = false`.

##### Arguments
1. `name`[String]: A name as identifier
1. `code`[String]: JavaScript code, written in amd-style. 
1. `cb`[Function]: Callback-function form `fs.writeFile` with the arguments:
    1. `error`[Error]: Used for exceptions
1. `opts`[Object]: Options:
    * `minify`[Boolean]: Minify code (default true)

#### ext.defineCDN(name, url, cb)
Define a module from cdn.

##### Arguments
1. `name`[String]: A name as identifier
1. `url`[String]: URL to JS-Resource. 
1. `cb`[Function]: Callback-function form `fs.writeFile` with the arguments:
    1. `error`[Error]: Used for exceptions
    1. `success`[Boolean]: True on success

#### ext.get = function(name, cb)
Get the content of a resource as buffer.

##### Arguments
1. `name`[String]: A name as identifier
1. `cb`[Function]: Callback-function form `fs.readFile` with the arguments:
    1. `error`[Error]: Used for exceptions
    1. `code`[Buffer]: Content of file as buffer

#### ext.getStream = function(name)
Get a stream of a resource.

##### Arguments
1. `name`[String]: A name as identifier

Returns a stream from `fs.createReadStream`.
    
#### ext.undefine = function(name, cb)
Remove a script from defined functions by its name.

##### Arguments
1. `name`[String]: A name as identifier
1. `cb`[Function]: Callback-function form `fs.readFile` with the arguments:
    1. `error`[Error]: Used for exceptions


#### ext.mkScriptTag = function(mainName)
Returns a html-script-tag with `mainName` as start script for amd.

##### Arguments
1. `mainName`[String]: A name as identifier

Returns a HTML-script tag with require.js and loads `mainName` with its dependencies.