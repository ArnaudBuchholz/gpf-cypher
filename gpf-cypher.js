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

// Open the streams
/*
 * TODO:
 *   handle synchronization: when everything is loaded, trigger the function
 *   handle default output for decrypt
 *
 */
var
    input,
    output,
    keys = [],
    len,
    idx;
gpf.fs.readAsBinaryStream(parameters.input, function (event) {
    if ("error" === event.type()) {
        console.error("Error while getting input stream");
    }
    input = event.get("stream");
});
if ("*" === parameters.output) {
    console.error("Default output not supported yet");
} else {
    gpf.fs.writeAsBinaryStream(parameters.output, function (event) {
        if ("error" === event.type()) {
            console.error("Error while getting output stream");
        }
        output = event.get("stream");
    });
}
len = parameters.keys.length;
for (idx = 0; idx < len; ++idx) {
    /*jshint -W083*/ // Used to avoid incorrect use of idx
    gpf.fs.readAsBinaryStream(parameters.keys[idx], (function (idx) {
        return function (event) {
            if ("error" === event.type()) {
                console.error("Error while getting key stream");
            }
            keys[idx] = event.get("stream");
        };
    })(idx));
}