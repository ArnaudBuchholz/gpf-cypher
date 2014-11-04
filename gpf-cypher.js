window.onlad=gpf.loaded(function () {
    "use strict";

    var
        _license =
            "# Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3"
            + ".0)\r\n\r\nThis is a human-readable summary of (and not a substi"
            + "tute for) the\r\n[license](http://creativecommons.org/licenses/b"
            + "y-nc-sa/3.0/legalcode).\r\n\r\n**You are free to**:\r\n\r\n* **S"
            + "hare** - copy and redistribute the material in any medium or for"
            + "mat\r\n* **Adapt** - remix, transform, and build upon the materi"
            + "al\r\n\r\nThe licensor cannot revoke these freedoms as long as y"
            + "ou follow the license\r\nterms.\r\n\r\n**Under the following ter"
            + "ms**:\r\n\r\n* **Attribution** - You must give appropriate credi"
            + "t, provide a link to the\r\nlicense, and indicate if changes wer"
            + "e made. You may do so in any reasonable\r\nmanner, but not in an"
            + "y way that suggests the licensor endorses you or your use.\r\n* "
            + "**NonCommercial** - You may not use the material for commercial "
            + "purposes.\r\n* **ShareAlike** - If you remix, transform, or buil"
            + "d upon the material, you must\r\ndistribute your contributions u"
            + "nder the same license as the original.\r\n\r\n**No additional re"
            + "strictions** - You may not apply legal terms or technological\r"
            + "\nmeasures that legally restrict others from doing anything the "
            + "license permits.\r\n\r\n**Notices**:\r\n\r\nYou do not have to c"
            + "omply with the license for elements of the material in the\r\npu"
            + "blic domain or where your use is permitted by an applicable exce"
            + "ption or\r\nlimitation.\r\n\r\nNo warranties are given. The lice"
            + "nse may not give you all of the permissions\r\nnecessary for you"
            + "r intended use. For example, other rights such as publicity,\r\n"
            + "privacy, or moral rights may limit how you use the material.\r"
            + "\n",

        /**
         * File handler:
         * base methods to allow browse dialog as well as drag & drop of files
         *
         * @type {Object}
         */
        FileHandler = {

            /**
             * Retrieved FILE
             *
             * @type {Object}
             * @private
             */
            _file: null,

            /**
             * Dynamically created file input
             *
             * @type {Object}
             * @private
             */
            _fileInput: null,

            /**
             * Used to open the browse dialog.
             * Must be connected to an HTML handler (see below)
             *
             * @param {Object} event the HTML event object
             * @private
             */
            _onBrowse: function (/*event*/) {
                if (null === this._fileInput) {
                    // TODO find a better way to achieve this
                    var div = document.createElement("div");
                    div.innerHTML = "<input type=\"file\" id=\"sourceFile\""
                        + " class=\"hide\">";
                    this._fileInput = this._ui.appendChild(div.firstChild);
                    gpf.html.handle(this);
                }
                this._fileInput.click();
            },

            /**
             * Triggered when the user selected a file through the browse dialog
             *
             * @param {Object} event the HTML event object
             * @private
             */
            "[_onBrowsed]": [gpf.$HtmlEvent("change", "input[type=file]")],
            _onBrowsed: function (event) {
                var file = event.target.files[0];
                if (undefined !== file) {
                    this._file = file;
                    this._onFileSelected(file);
                }
            },

            /**
             * Drag & Drop implementation, Drag Over part
             * Must be connected to an HTML handler (see below)
             *
             * @param {Object} event the HTML event object
             * @private
             */
            _onDragOver: function (event) {
                // Check this is a file
                event.stopPropagation();
                event.preventDefault();
                var
                    files = event.dataTransfer.files;
                if (files && 1 === files.length) {
                    event.dataTransfer.dropEffect = "copy";
                } else {
                    event.dataTransfer.dropEffect = "none";
                }
            },

            /**
             * Drag & Drop implementation, Drag Over part
             * Must be connected to an HTML handler (see below)
             *
             * @param {Object} event the HTML event object
             * @private
             */
            _onDrop: function (event) {
                event.stopPropagation();
                event.preventDefault();
                var
                    files = event.dataTransfer.files;
                if (files && 1 === files.length) {
                    this._file = files[0];
                    this._onFileSelected(this._file);
                }
            }
        },

        Controller = gpf.define("Controller", {

            public: {

                /**
                 * @constructor
                 */
                constructor: function () {
                    gpf.html.handle(this, "thead");
                    this._onDisplayResult();
                }

            },

            private: gpf.extend({

                //region FileHandler

                /**
                 * Missing attributes to connect FileHandler methods
                 */
                "[_onBrowse]": [gpf.$HtmlEvent("click", "a.button.icon_file")],
                "[_onDragOver]": [
                    gpf.$HtmlEvent("dragover", "a.button.icon_file")
                ],
                "[_onDrop]": [gpf.$HtmlEvent("drop", "a.button.icon_file")],

                /**
                 * When a file is opened / dropped
                 *
                 * @param {Object} file HTML5 File handler
                 * @private
                 */
                _onFileSelected: function (file) {
                    alert(file.name);
                    gpf.html.removeClass(this._ui, "unlock");
                    gpf.html.addClass(this._ui, "lock");
                    this._source = null;
                },

                //endregion

                //region HTML Mappings

                "[_ui]": [gpf.$HtmlHandler()],
                _ui: null,

                "[_infoUI]": [gpf.$HtmlHandler("tbody.info", true)],
                _infoUI: null,

                "[_resultUI]": [gpf.$HtmlHandler("tbody.result", true)],
                _resultUI: null,

                "[_cypherUI]": [gpf.$HtmlHandler("tbody.cypher", true)],
                _cypherUI: null,

                "[_sourceUI]": [gpf.$HtmlHandler("tbody.source", true)],
                _sourceUI: null,

                //endregion

                //region Modes handling

                /**
                 * Modes definitions:
                 * Mapping of mode name to:
                 * - ui to show
                 * - buttons to show
                 *
                 * @type {Object}
                 * @private
                 */
                _modes: {
                    "display": {
                        ui: "result",
                        buttons: ["edit", "file", "info"]
                    },
                    "info": {
                        ui: "info",
                        buttons: ["back"]
                    },
                    "source": {
                        ui: "source",
                        buttons: ["view", "lock", "save", "info"]
                    },
                    "key": {
                        ui: "cypher",
                        buttons: ["unlock", "save", "info"]
                    }
                },

                /**
                 * Current mode
                 *
                 * @type {String}
                 * @private
                 */
                _mode: "",

                /**
                 * Mode switching helper
                 *
                 * @param {String} mode Mode to switch to
                 * @private
                 */
                _switchMode: function (mode) {
                    var
                        ui,
                        buttons,
                        len,
                        idx,
                        button,
                        name;
                    if (this._mode) {
                        ui = this._modes[this._mode].ui;
                        gpf.html.addClass(this["_" + ui + "UI"], "hide");
                    }
                    this._mode = mode;
                    mode = this._modes[mode];
                    gpf.html.removeClass(this["_" + mode.ui + "UI"], "hide");
                    buttons = document.querySelectorAll("thead a");
                    len = buttons.length;
                    for (idx = 0; idx < len; ++idx) {
                        button = buttons[idx];
                        name = button.className.split(" ")[1].substr(5);
                        if (-1 === mode.buttons.indexOf(name)) {
                            gpf.html.addClass(button, "hide");
                        } else {
                            gpf.html.removeClass(button, "hide");
                        }
                    }
                },

                //endregion

                //region About screen management

                /**
                 * About screen button
                 */
                "[_onAbout]": [gpf.$HtmlEvent("click", "a.button.icon_info")],
                _onAbout: function (/*event*/) {
                    this._previousMode = this._mode;
                    this._switchMode("info");
                },

                /**
                 * Previous mode (before displaying about)
                 *
                 * @type {String}
                 * @private
                 */
                _previousMode: "",

                /**
                 * Back from about screen
                 */
                "[_onBack]": [gpf.$HtmlEvent("click", "a.button.icon_back")],
                _onBack: function (/*event*/) {
                    this._switchMode(this._previousMode);
                },

                //endregion

                _source: _license, // Default

                _decodeSource: function (callback) {
                    if (null === this._source) {
                        // TODO animate
                        gpf.defer(callback, 10, this);
                    } else {
                        callback.apply(this, []);
                    }
                },

                "[_onEditSource]": [
                    gpf.$HtmlEvent("click", "a.button.icon_edit")
                ],
                _onEditSource: function (/*event*/) {
                    this._decodeSource(this._onEditDecodedSource);
                },

                _onEditDecodedSource: function () {
                    var
                        textarea = this._sourceUI.querySelector("textarea");
                    textarea.value = this._source;
                    this._switchMode("source");
                },

                "[_onSourceEdited]": [
                    gpf.$HtmlEvent("click", "a.button.icon_view")
                ],
                _onSourceEdited: function (/*event*/) {
                    var
                        textarea = this._sourceUI.querySelector("textarea");
                    this._source = textarea.value;
                    this._onDisplayResult();
                },

                _onDisplayResult: function () {
                    var
                        parser,
                        output;
                    parser = new gpf.html.MarkdownParser();
                    output = ["<tr><td>"];
                    parser.setOutputHandler(output);
                    parser.parse(this._source, null);
                    output.push("</td></tr>");
                    this._resultUI.innerHTML = output.join("");
                    this._switchMode("display");
                },

                "[_onSave]": [
                    gpf.$HtmlEvent("click", "a.button.icon_save")
                ],
                _onSave: function (/*event*/) {
                    // Testing save algorithm
                    var
                        utf8Stream = gpf.encoding.createEncoder(
                            gpf.stringToStream(this._source),
                            gpf.encoding.UTF_8);
                    gpf.stream.readAllAsB64(utf8Stream, function (event) {
                        // TODO modify the button URL to allow right click on it
                        var
                            b64string = event.get("buffer"),
                            // http://stackoverflow.com/questions/3916191/
                            link;
                        link = document.createElement("a");
                        link.setAttribute("download", "gpf-cypher.bin");
                        link.setAttribute("href",
                            "data:application/octet-stream;base64,"
                            + b64string);

                        link.click();
                    });
                },

                "[_onEditKey]": [
                    gpf.$HtmlEvent("click", "a.button.icon_lock")
                ],
                _onEditKey: function (/*event*/) {
                    this._switchMode("key");
                }

            }, FileHandler)

        }),

        NewKeyHandler = gpf.define("NewKeyHandler", {

            static: {
                list: [],
                template: null
            },

            public: {

                /**
                 * @constructor
                 */
                constructor: function () {
                    //gpf.html.handle(this,
                    //    "tbody.cypher div.box.unselected.icon_key");
                }

            },

            private: gpf.extend({

                /**
                 * Missing attributes to connect FileHandler methods
                 */
                "[_onBrowse]": [gpf.$HtmlEvent("click", "a.button.icon_file")],
                "[_onDragOver]": [gpf.$HtmlEvent("dragover")],
                "[_onDrop]": [gpf.$HtmlEvent("drop")],

                /**
                 * When a file is opened / dropped
                 *
                 * @param {Object} file HTML5 File handler
                 * @private
                 */
                _onFileSelected: function (file) {
                    alert(file.name);
                }

            }, FileHandler)

        });

    var
        controller = new Controller(),
        newKeyHandler = new NewKeyHandler()/*,
        domTemplate = gpf.html.handle(new Key(), ".box.unselected.key");
    NewKeyHandler.template = domTemplate.cloneNode(true)*/;

});
