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

        Box = gpf.define("Box", {

            protected: {

                _file: null,

                onFileSelected: function (file) {
                    this._file = file;
                },

                setTitle: function (text) {
                    this._ui.querySelector("div.title").innerHTML =
                        gpf.escapeFor(text, "html");
                },

                setToolbar: function () {
                    this._ui.querySelector("div.toolbar").innerHTML = "";
                }

            },

            private: {

                "[_ui]": [gpf.$HtmlHandler()],
                _ui: null,

                _fileInput: null,

                "[_onBrowse]": [gpf.$HtmlEvent("click", "div.button.file")],
                _onBrowse: function (/*event*/) {
                    if (null === this._fileInput) {
                        // TODO find a better way to achieve this
                        var div = document.createElement("div");
                        div.innerHTML = "<input type=\"file\" id=\"sourceFile\""
                            + " class=\"hide\">";

                        this._fileInput = this._ui.appendChild(div.firstChild);
                        // TODO see if it can be done automatically
                        gpf.html.handle(this);
                    }
                    this._fileInput.click();
                },

                "[_onBrowsed]": [gpf.$HtmlEvent("change", "input[type=file]")],
                _onBrowsed: function (event) {
                    var file = event.target.files[0];
                    if (undefined !== file) {
                        this.onFileSelected(file);
                    }
                },


                "[_onDragOver]": [gpf.$HtmlEvent("dragover")],
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

                "[_onDrop]": [gpf.$HtmlEvent("drop")],
                _onDrop: function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    var
                        files = event.dataTransfer.files;
                    if (files && 1 === files.length) {
                        this.onFileSelected(files[0]);
                    }
                }

            }
        }),

        Controller = gpf.define("Controller", Box, {

            public: {

                init: function () {
                    this._switchMode("display");
                    this._onDisplayResult();
                }

            },

            protected: {

                onFileSelected: function (file) {
                    // this.baseOnFileSelected(file);
                    gpf.html.removeClass(this._ui, "unlock");
                    gpf.html.addClass(this._ui, "lock");
                    this._source = null;
                }

            },

            private: {

                "[_infoUI]": [gpf.$HtmlHandler("tbody.info", true)],
                _infoUI: null,

                "[_resultUI]": [gpf.$HtmlHandler("tbody.result", true)],
                _resultUI: null,

                "[_cypherUI]": [gpf.$HtmlHandler("tbody.cypher", true)],
                _cypherUI: null,

                "[_sourceUI]": [gpf.$HtmlHandler("tbody.source", true)],
                _sourceUI: null,

                _source: _license, // Default

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
                _mode: "",

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
                        name = button.className.split(' ')[1].substr(5);
                        if (-1 === mode.buttons.indexOf(name)) {
                            gpf.html.addClass(button, "hide");
                        } else {
                            gpf.html.removeClass(button, "hide");
                        }
                    }
                },

                _decodeSource: function (callback) {
                    if (null === this._source) {
                        // TODO animate
                        gpf.defer(callback, 10, this);
                    } else {
                        callback.apply(this, []);
                    }
                },

                "[_onEditSource]": [gpf.$HtmlEvent("click",
                    "thead a.button.icon_edit")],
                _onEditSource: function (/*event*/) {
                    gpf.html.addClass(this._resultUI, "hide");
                    gpf.html.removeClass(this._sourceUI, "hide");
                    this._decodeSource(this._onEditDecodedSource);
                },

                _onEditDecodedSource: function () {
                    var
                        textarea = this._sourceUI.querySelector("textarea");
                    textarea.value = this._source;
                },

                "[_onSourceEdited]": [
                    gpf.$HtmlEvent("click", "div.text div.button.save", true)
                ],
                _onSourceEdited: function (/*event*/) {
                    var
                        textarea = this._textUI.querySelector("textarea");
                    this._source = textarea.value;
                    gpf.html.removeClass(this._workspaceUI, "hide");
                    gpf.html.addClass(this._textUI, "hide");
                },

                "[_onSwitchView]": [
                    gpf.$HtmlEvent("click", "div.footer div.button.key", true)
                ],
                _onSwitchView: function (/*event*/) {
                    var
                        displayed = !gpf.html.hasClass(this._resultUI, "hide");
                    if (displayed) {
                        gpf.html.addClass(this._resultUI, "hide");
                        gpf.html.removeClass(this._workspaceUI, "hide");
                    } else {
                        if (!gpf.html.hasClass(this._textUI, "hide")) {
                            this._onSourceEdited();
                        }
                        this._decodeSource(this._onDisplayResult);
                    }
                },

                _onDisplayResult: function () {
                    var
                        parser,
                        output;
                    parser = new gpf.html.MarkdownParser();
                    output = [];
                    parser.setOutputHandler(output);
                    parser.parse(this._source, null);
                    this._resultUI.innerHTML = output.join("");
                }

            }

        }),

        Key = gpf.define("Key", Box, {

            static: {
                list: [],
                template: null
            },

            private: {

                onKeySelected: function (type) {
                    this._ui.className = "box selected " + type;
                    this.setToolbar();
                    Key.list.push(this);
                    // Create a new key placeholder
                    var newKey = this._ui.parentNode
                        .appendChild(Key.template.cloneNode(true));
                    gpf.html.handle(new Key(), newKey);
                }

            },

            protected: {
                onFileSelected: function (file) {
                    this.onKeySelected("file");
                    this.setTitle("Size: " + file.size);
                }
            }

        });

    var controller = new Controller();
    gpf.html.handle(controller, document);
    controller.init();
//    var domTemplate = gpf.html.handle(new Key(), ".box.unselected.key");
//    Key.template = domTemplate.cloneNode(true);

});
