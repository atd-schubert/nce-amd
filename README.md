# AMD extension for NCE
## Description
An AMD implemention for nce with requirejs

## How to install
Install with npm: `npm install --save nce-amd`

Integrate in NCE:

```
var NCE = require("nce");
var nce = new NCE(/*{}*/);
var amd = require("nce-amd");
var ext = amd(nce);
ext.install();
ext.activate();
```

Or use nce-extension-manager...

## How to use
### Basic funcitons
*Describe the functions of your extension*