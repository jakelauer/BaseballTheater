'use strict';
const path = require('path');
const fs = require('fs-extra');
const swaggerJSDoc = require('swagger-jsdoc');

const appDirectory = fs.realpathSync(process.cwd());
const resolve = relativePath => path.resolve(appDirectory, relativePath);

const options = {
    definition: {
        info: {
            title: 'BaseballTheater', // Title (required)
            version: '1.0.0', // Version (required)
        },
    },
    // Path to the API docs
    apis: [resolve("output/server/server.js")],
};

const buildSwagger = () => {
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
    const swaggerSpec = swaggerJSDoc(options);

// Generate the swagger def
    fs.writeFile(resolve("output/client/swagger.json"), JSON.stringify(swaggerSpec, null, 2), 'utf8');
};

module.exports = {
    buildSwagger
};