var gpf;
try {
    gpf = require("gpf-js");
} catch (e) {
    console.error("require(gpf-js) failed: use npm install gpf-js");
    console.error(e);
    process.exit();
}
console.log("Using GPF framework version " + gpf.version());
// Parse command line parameters
try {
    var parameters = gpf.Parameter.parse([{
        name: "input",
        required: true,
        type: "string"
    }, {
        name: "output",
        type: "string",
        defaultValue: "*"
    }, {
        name: "key",
        type: "string",
        prefix: "key",
        multiple: true
    }, gpf.Parameter.VERBOSE, gpf.Parameter.HELP], process.argv.slice(2));
} catch (e) {
    console.error(e.message);
    process.exit();
}

for (var key in parameters) {
    if (parameters.hasOwnProperty(key)) {
        console.log(key + "          : ".substr(key.length) + parameters[key]);
    }
}
