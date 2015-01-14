var gpf;
try {
    gpf = require("gpf-js");
} catch (e) {
    console.error("require(gpf-js) failed: use npm install gpf-js");
    console.error(e);
    process.exit();
}
console.log("Using GPF framework version " + gpf.version());