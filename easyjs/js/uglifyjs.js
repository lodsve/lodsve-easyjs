var fs = require('fs');
var path = require('path');
var process = require('child_process');
var npmDir = path.join("F:", "study", "npm", "uglifyjs");

function ls(dir) {
    var files = fs.readdirSync(dir);

    for (fn in files) {
        var fname = dir + path.sep + files[fn];
        var stat = fs.lstatSync(fname);

        if (stat.isDirectory() == true) {
            ls(fname);
        } else {
            if (fname.indexOf(".min") < 0 && fname.indexOf(".js") == (fname.length - 3)) {
                var path_ = path.dirname(fname);
                var baseName = path.basename(fname, ".js");

                var minFileName = path_ + path.sep + baseName + ".min.js";
                process.exec(npmDir + " " + fname + " -m -o " + minFileName, function (error, stdout, stderr) {
                    var msg = error ? "执行错误！" + error : "压缩完成！";
                    console.log(msg);
                });
            }
        }
    }
}

ls('plugins');