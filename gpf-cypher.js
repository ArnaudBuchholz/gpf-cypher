"use strict";

// dev version
try {
    require("../gpf-js/boot.js");
} catch(e) {}

if (!gpf) {
    // prod version
    try {
        global.gpf = require("gpf-js");
    } catch (e) {
        console.error("require(gpf-js) failed: use npm install gpf-js");
        console.error(e);
        process.exit();
    }
}

console.log("Using GPF framework version " + gpf.version());
require("./core.js");

// Parse command line parameters
try {
    var parameters = gpf.Parameter.parse([{
        name: "mode",
        required: true,
        type: "string"
    }, {
        name: "input",
        required: true,
        type: "string"
    }, {
        name: "output",
        type: "string",
        defaultValue: "*"
    }, {
        name: "keys",
        type: "string",
        prefix: "key",
        multiple: true
    }, gpf.Parameter.VERBOSE, gpf.Parameter.HELP], process.argv.slice(2));
} catch (e) {
    console.error(e.message);
    process.exit();
}

// Additional validation
if (-1 === ["crypt", "decrypt"].indexOf(parameters.mode)) {
    console.error("Unsupported mode, select crypt or decrypt");
}
if ("crypt" === parameters.mode && "*" === parameters.output) {
    console.error("Default output not allowed for crypt");
}

// Dump parameters
if (parameters.verbose) {
    for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            console.log(key + "          : ".substr(key.length)
                + parameters[key]);
        }
    }
}

// Convert output parameter
if ("*" === parameters.output) {
    parameters.output = new gpf.stream.Out();
}

function processEnd(event) {
    if ("error" === event.type()) {
        console.error("failed.");
    } else {
        console.log("done.");
    }
}

if ("crypt" === parameters.mode) {
    gpf.cypher.crypt(parameters.input, parameters.output, parameters.keys,
        processEnd);
} else {
    gpf.cypher.decrypt(parameters.input, parameters.output, parameters.keys,
        processEnd);
}
