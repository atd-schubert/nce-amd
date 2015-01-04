"use strict";

var NCE = require("nce");
var Ext = require("../");
var Logger = require("nce-winston");

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
  
  var logger = Logger(nce); logger.install(); logger.activate();
  
  var ext = Ext(nce);
  
  it('should be installable', function(done){
    if(ext.install()) return done();
    return done(new Error("Can not install extension"));
  });
  it('should be activatable', function(done){
    if(ext.activate()) return done();
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
  var nce = new NCE({amd:{dumpPath:__dirname + "/amd"}});
  
  var logger = Logger(nce); logger.install(); logger.activate();
  
  var ext = Ext(nce); ext.install(); ext.activate();
  
  var fnStr = 'define([], "test", function(){console.log("It works...");});';
  
  it('should define a function', function(done){
    ext.define("test", fnStr, done);
  });
  it('should get a defined function', function(done){
    ext.get("test", function(err, code){
      if(code.toString() === fnStr) return done();
      return done("Wrong Code");
    });
  });
});