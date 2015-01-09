"use strict";

var fs = require("fs");
var NCE = require("nce");
var ExtMgr = require("nce-extension-manager");
var Ext = require("../");

describe('Basic integration in NCE', function(){
  var nce = new NCE();
  it('should be insertable into NCE', function(done){
    var ext = Ext(nce);
    if(ext) return done();
    return done(new Error("Is not able to insert extension into NCE"));
  });
});
describe('Basic functions in NCE', function(){
  var nce = new NCE();
  var ext = Ext(nce);
  var extMgr = ExtMgr(nce);
  extMgr.activateExtension(extMgr);
  
  it('should be installable', function(done){
    if(extMgr.installExtension(ext) && ext.status === "installed") return done();
    return done(new Error("Can not install extension"));
  });
  it('should be activatable', function(done){
    if(extMgr.activateExtension(ext) && ext.status === "activated") return done();
    return done(new Error("Can not activate extension"));
  });
  it('should be deactivatable', function(done){
    if(ext.deactivate()) return done();
    return done(new Error("Can not deactivate extension"));
  });
  it('should be uninstallable', function(done){
    if(ext.uninstall()) return done();
    return done(new Error("Can not uninstall extension"));
  });
  
  it('should be installable again', function(done){
    if(ext.install()) return done();
    return done(new Error("Can not install extension"));
  });
  it('should be activatable again', function(done){
    if(ext.activate()) return done();
    return done(new Error("Can not activate extension"));
  });
  it('should be deactivatable again', function(done){
    if(ext.deactivate()) return done();
    return done(new Error("Can not deactivate extension"));
  });
  it('should be uninstallable again', function(done){
    if(ext.uninstall()) return done();
    return done(new Error("Can not uninstall extension"));
  });
});
describe('Methods of the extension', function(){
  var nce = new NCE({amd:{dumpPath:__dirname + "/../dump4test"}});
  var ext = Ext(nce);
  var extMgr = ExtMgr(nce);
  extMgr.activateExtension(extMgr);
  extMgr.activateExtension(ext);
  
  var fnStr = fs.readFileSync(__dirname + "/../example4test.js").toString();
  
  it('should define a function without minifing', function(done){
    ext.define("test", fnStr, done, {minify:false});
  });
  it('should get a defined function', function(done){
    ext.get("test", function(err, code){
      if(code.toString() === fnStr) return done();
      return done(new Error("Wrong Code"));
    });
  });
  it('should define a function with minifing', function(done){
    ext.define("test", fnStr, done);
  });
  it('should get minified code', function(done){
    ext.get("test", function(err, code){
      if(fnStr.length <= code.toString().length) {
        return done(new Error("Code was not minified"));
      }
      return done();
    });
  });
});