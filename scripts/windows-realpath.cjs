// Windows sandbox compatibility: use Node's non-native resolver for existing
// project files when the native realpath API reports EPERM. No access is widened.
if (process.platform === 'win32') {
  const fs = require('node:fs');
  const path = require('node:path');
  const root = path.resolve(__dirname, '..') + path.sep;
  const original = fs.promises.realpath.bind(fs.promises);
  fs.promises.realpath = async function(file, options) {
    try { return await original(file, options); }
    catch (error) {
      if (error.code === 'EPERM' && typeof file === 'string' && path.resolve(file).startsWith(root)) return fs.realpathSync(file, options);
      throw error;
    }
  };
  const mkdir = fs.promises.mkdir.bind(fs.promises);
  fs.promises.mkdir = async function(file, options) {
    try { return await mkdir(file, options); }
    catch (error) {
      if (error.code === 'EPERM' && typeof file === 'string' && path.resolve(file).startsWith(root)) return fs.mkdirSync(file, options);
      throw error;
    }
  };
  const mkdirCallback = fs.mkdir.bind(fs);
  fs.mkdir = function(file, options, callback) {
    if (typeof options === 'function') { callback = options; options = undefined; }
    return mkdirCallback(file, options, (error, result) => {
      if (error && error.code === 'EPERM' && typeof file === 'string' && path.resolve(file).startsWith(root)) {
        try { result = fs.mkdirSync(file, options); error = null; }
        catch (fallbackError) { error = fallbackError; }
      }
      callback(error, result);
    });
  };
}
