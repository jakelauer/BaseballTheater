'use strict';
const path = require('path');
const fs = require('fs-extra');
const Seven = require("node-7z");
const sevenBin = require('7zip-bin');

const appDirectory = fs.realpathSync(process.cwd());
const resolve = relativePath => path.resolve(appDirectory, relativePath);


const finalize = (buildName, buildDir, outputDir) => {
    fs.mkdir(path.resolve(outputDir, "server/config"));

    fs.copyFileSync(resolve("server/apikeys.json"), path.resolve(outputDir, "server/apikeys.json"));
    fs.copyFileSync(resolve("server/config/keys.json"), path.resolve(outputDir, "server/config/keys.json"));

    fs.copySync(resolve("client/build"), path.resolve(outputDir, "client"), {dereference: true});
    fs.copyFileSync(resolve("server/package.json"), path.resolve(buildDir, "package.json"));
    fs.copyFileSync(resolve("server/.env"), path.resolve(outputDir, "./.env"));

    const zipPath = path.resolve(buildDir, "../" + buildName + ".zip");
    const toAdd = path.resolve(buildDir, "./*.*");
    Seven.add(zipPath, toAdd, {
        recursive: true,
        $bin: sevenBin.path7za,
    });
};

module.exports = {
    finalize
};