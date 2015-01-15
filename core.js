(function () { /* Begin of privacy scope */
    "use strict";

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

        }

    };

}()); /* End of privacy scope */