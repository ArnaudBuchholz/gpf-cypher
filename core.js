(function () { /* Begin of privacy scope */
    "use strict";

    function getStream (value, readOrWrite, resultArray, idx, onComplete) {
        var valueType = typeof value;
        if ("object" === valueType) {
            if (readOrWrite) {
                resultArray[idx] =
                    gpf.interfaces.query(value, gpf.interfaces.IReadableStream);
            } else {
                resultArray[idx] =
                    gpf.interfaces.query(value, gpf.interfaces.IWritableStream);
            }
            onComplete(); // Succeeded
        } else if ("string" === valueType) {
            if (readOrWrite) {
                gpf.fs.readAsBinaryStream(value, function (event) {
                    if ("error" === event.type()) {
                        onComplete(event); // Failed
                    } else {
                        resultArray[idx] = event.get("stream");
                        onComplete();
                    }
                });
            } else {
                gpf.fs.writeAsBinaryStream(value, function (event) {
                    if ("error" === event.type()) {
                        onComplete(event); // Failed
                    } else {
                        resultArray[idx] = event.get("stream");
                        onComplete();
                    }
                });
            }
        } else {
            // Invalid parameter
            onComplete("Invalid parameter");
        }
    }

    function processParameters(input, output, keys, callback, eventsHandler) {
        var len = keys.length,
            idx,
            params = new Array(4),
            keyStreams = new Array(keys.length),
            count = 2 + len,
            onComplete = function (event) {
                if (event && -1 !== count) {
                    gpf.events.fire(event, eventsHandler);
                } else if (0 === --count) {
                    callback.apply(this, params);
                }
            };
        params[2] = keyStreams;
        params[4] = eventsHandler;
        getStream(input, true, params, 0, onComplete);
        getStream(output, false, params, 1, onComplete);
        for (idx = 0; idx < len; ++idx) {
            getStream(keys[idx], true, keyStreams, idx, onComplete);
        }
    }

    function doCrypt(input, output, keys, eventsHandler) {

    }

    function doDecrypt(input, output, keys, eventsHandler) {

    }

    // Extend existing
    gpf.cypher = {

        /**
         * Crypt the input stream using keys and push the result data in the
         * output stream
         *
         * @param {gpf.IReadableStream} input
         * @param {gpf.IWritableStream} output
         * @param {gpf.IReadableStream[]} keys
         * @param {gpf.events.Handler} eventsHandler
         *
         * @event ready
         */
        crypt: function (input, output, keys, eventsHandler) {
            processParameters(input, output, keys, doCrypt, eventsHandler);
        },

        /**
         * Decrypt the input stream using keys and push the result data in the
         * output stream
         *
         * @param {gpf.IReadableStream} input
         * @param {gpf.IWritableStream} output
         * @param {gpf.IReadableStream[]} keys
         * @param eventsHandler
         *
         * @event ready
         */
        decrypt: function (input, output, keys, eventsHandler) {
            processParameters(input, output, keys, doDecrypt, eventsHandler);
        }

    };

}()); /* End of privacy scope */