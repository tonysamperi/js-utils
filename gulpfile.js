const {task} = require("gulp");
const {exec} = require('child_process');
//
const pkg = require("./package.json");

task("tag", (cb) => {
    const major = pkg.version.split(".")[0];
    const cmd = `npm dist-tag add ${pkg.name}@${pkg.version} [latest-v${major}]`;
    console.info("running", cmd);
    exec(cmd, (err, stdOut, stdErr) => {
        console.log(stdOut);
        console.log(stdErr);
        cb(err);
    })
});
