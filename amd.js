"use strict";

var fs = require("fs");
var UglifyJS = require("uglify-js");
var md5 = require("MD5");
var path = require("path");

module.exports = function(nce){
  if(!nce) throw new Error("You have to specify the nce object");
  
//# Mandantory Setup:
  var ext = nce.createExtension({package: require("./package.json")});
  
  ext.on("install", function(event){ // set options, but don't run or make available in nce
    //# Seting extension-config:
    ext.config.route = ext.config.route || "/"+ext.name;
    ext.config.dumpPath = ext.config.dumpPath || process.cwd() + "/amd";
    
    //* nce-winston
    ext.config.logger = ext.config.logger || {};

    //# Declarations and settings:
    //* nce-winston
    ext.logger = nce.getExtension("winston").createLogger(ext.name, ext.config.logger);
    
  });
  
  ext.on("uninstall", function(event){ // undo installation
    //# Undeclare:
    //* nce-winston
    nce.getExtension("winston").removeLogger(ext.name);
    delete ext.logger;
  });
  
  ext.on("activate", function(event){ // don't set options, just run, make available in nce or register.
	  if(nce.requestMiddlewares.indexOf(router) === -1) {
		  nce.requestMiddlewares.push(router);
	  }
  });
  
  ext.on("deactivate", function(event){ // undo activation
	  if(nce.requestMiddlewares.indexOf(router) !== -1) {
		  nce.requestMiddlewares.splice(nce.requestMiddlewares.indexOf(router), 1);
	  }
  });
  
//# Private declarations:
  var cdn = {};
  var router = function(req, res, next){
    if(req.url.substr(0, ext.config.route.length) === ext.config.route) {
      if(/^\/requirejs.js/.test(req.url.substr(ext.config.route.length))) {
        var stream = fs.createReadStream(__dirname + "/assets/requirejs.js");
        var etag = md5(ext.name + "-" + ext.package.version);)
        if(req.headers.etag === etag) {
          res.writeHead(304, {
            "content-type":"text/javascript",
            "etag": etag
          });
          return res.end();
        }
        res.writeHead(200, {
          "content-type":"text/javascript",
          "etag": etag
        });
        stream.on("error", function(err){
          next(err);
        });
        stream.on("data", function(data){
          res.write(data);
        });
        return stream.on("end", function(data){
          if(data) res.write(data);
          res.write([
            'require.config({',
              'baseUrl: "'+ext.config.route+'",',
              'paths: '+ JSON.stringify(cdn),
            '});'
        ].join(""));
          res.end();
        });
      };
      
      
      var amdPath = ext.config.dumpPath + req.url.substr(ext.config.route.length);
      if(path.relative(ext.config.dumpPath, amdPath).substr(0,2)=== "..") {// TODO #4: security! Don't make able to go in dirs upper then lib-root!
        res.writeHead(403, {
          "content-type":"text/plain"
        });
        var msg = "It is forbidden to requested a file from above of the amd-root!";
        ext.logger.warn(msg, req);
        return res.end(msg);
      }
      return fs.stat(amdPath, function(err, stats){
        if(err && err.message.indexOf("ENOENT") === 0) return next();
        if(err) return next(err);
        var etag = md5(stats.ino + stats.mtime.getTime());
        
        if(req.headers.etag === etag) {
          res.writeHead(304, {
            "content-type":"text/javascript",
            "etag": etag,
            "content-length":stats.size
          });
          return res.end();
        }
        var stream = fs.createReadStream(amdPath);
        
        res.writeHead(200, {
          "content-type":"text/javascript",
          "etag": etag,
          "content-length":stats.size
        });
        return stream.pipe(res);
      });
    }

    return next();
  };

//# Public declarations and exports:
  ext.define = function(name, code, cb, opts){
    opts = opts || {};
    if(opts.minify !== false) {
      if(opts.minify === true) opts.minify = {};
      opts.fromSting = true;
    }
    if(opts.minify) {
      code = UglifyJS.minify(code, opts.minify);
    }
    
    ext.emit("define", {name:name, code: code});
    ext.emit("define:"+name, {name:name, code: code});
    
    return fs.writeFile(ext.config.dumpPath + "/" + name + ".js", code, cb);
  };
  ext.defineCDN = function(name, url, cb, opts){
    opts = opts || {};
    cb = cb || function(){};
    
    ext.emit("defineCDN", {name:name, url: url});
    ext.emit("defineCDN:"+name, {name:name, url: url});
    
    cdn[name] = url;
    cb(null, true);
    return true;
  };
  ext.get = function(name, cb){
    return fs.readFile(ext.config.dumpPath + "/" + name + ".js", cb);
  };
  ext.getStream = function(name){
    return fs.createReadStream(ext.config.dumpPath + "/" + name + ".js");
  };
  ext.undefine = function(name, cb){
    fs.unlink(ext.config.dumpPath + "/" + name + ".js", function(err){
      if(err && err.message.indexOf("ENOENT") === 0) return cb();
      if(err) return cb(err);
      ext.emit("obscure", {name:name});
      ext.emit("obscure:"+name, {name:name});
      return cb();
    })
  };
  ext.mkScriptTag = function(mainName){ // TODO:
    var rg = ["<script "];
    if(mainName) rg.push('data-main="'+ mainName + '" ');
    rg.push('src="'+ext.config.route+'/require.js"');
    rg.push('></script>');
    return rg.join("");
  };
  
  return ext;
}