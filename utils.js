var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var chalk = require('chalk');
_.str = require('underscore.string');
_.mixin(_.str.exports());
var ngParseModule = require('ng-parse-module');


exports.JS_MARKER = "<!-- Add New Component JS Above -->";
exports.LESS_MARKER = "/* Add Component LESS Above */";

exports.ROUTE_MARKER = "/* Add New Routes Above */";
exports.ROUTE_MARKER_NAV = "<!-- Add New Routes Above -->";
exports.STATE_MARKER = "/* Add New States Above */";

exports.addToFile = function (filename, lineToAdd, beforeMarker) {
  try {
    var fullPath = path.resolve(process.cwd(), filename);
    var fileSrc = fs.readFileSync(fullPath, 'utf8');

    var indexOf = fileSrc.indexOf(beforeMarker);
    var lineStart = fileSrc.substring(0, indexOf).lastIndexOf('\n') + 1;
    var indent = fileSrc.substring(lineStart, indexOf);
    fileSrc = fileSrc.substring(0, indexOf) + lineToAdd + "\n" + indent + fileSrc.substring(indexOf);

    fs.writeFileSync(fullPath, fileSrc);
  } catch (e) {
    throw e;
  }
};

exports.inject = function (filename, that, module, name) {
  //special case to skip unit tests
  if (_(filename).endsWith('-spec.js') ||
    _(filename).endsWith('_spec.js') ||
    _(filename).endsWith('-test.js') ||
    _(filename).endsWith('_test.js')) {
    return;
  }

  var ext = path.extname(filename);
  if (ext[0] === '.') {
    ext = ext.substring(1);
  }
  var config = that.config.get('inject')[ext];
  if (config) {
    var configFile = _.template(config.file)({module: path.basename(module.file, '.js')});
    var injectFileRef = filename;
    if (config.relativeToModule) {
      configFile = path.join(path.dirname(module.file), configFile);
      injectFileRef = path.relative(path.dirname(module.file), filename);
    }
    injectFileRef = injectFileRef.replace(/\\/g, '/');
    var lineTemplate = _.template(config.template)({filename: injectFileRef});
    exports.addToFile(configFile, lineTemplate, config.marker);
    that.log.writeln(chalk.green(' updating') + ' %s', path.basename(configFile));
  }
};

exports.getParentModule = function (dir) {
  //starting this dir, find the first module and return parsed results
  if (fs.existsSync(dir)) {
    var files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
      if (path.extname(files[i]) !== '.js') {
        continue;
      }
      var results = ngParseModule.parse(path.join(dir, files[i]));
      if (results) {
        return results;
      }
    }
  }

  if (fs.existsSync(path.join(dir, '.yo-rc.json'))) {
    //if we're in the root of the project then bail
    return;
  }

  return exports.getParentModule(path.join(dir, '..'));
};

exports.getNameArg = function (that, args) {
  if (args.length > 0) {
    that.name = args[0];
  }
};
