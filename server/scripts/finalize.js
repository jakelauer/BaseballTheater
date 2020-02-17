'use strict';
const path = require('path');
const fs = require('fs-extra');

const appDirectory = fs.realpathSync(process.cwd());
const resolve = relativePath => path.resolve(appDirectory, relativePath);
const output = resolve("output");
const clientBuild = resolve("client/build");
const clientOutput = resolve("output/client");

function copyOutput() {
    fs.copySync(clientBuild, clientOutput, {
        dereference: true
    });
}

const finalize = () => {
    copyOutput();
    fs.copyFileSync(resolve("server/apikeys.json"), path.resolve(output, "server/apikeys.json"));
    fs.mkdir(path.resolve(output, "server/config"));
    fs.copyFileSync(resolve("server/config/keys.json"), path.resolve(output, "server/config/keys.json"));
};

module.exports = {
    finalize
};