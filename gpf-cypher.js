window.onlad=gpf.loaded(function () {
    "uses strict";

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
            + "privacy, or moral rights may limit how you use the material.\r\n"
        ,

        Box = gpf.define("Box", {

            protected: {

                onFileSelected: function (file) {
                    alert(file.name);
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
                            + " style=\"display: none;\">";

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
                        this.onFileSelected(file);
                    }
                }

            }
        }),

        Source = gpf.define("Source", Box, {

            private: {

                _source: _license,
                _displayed: false,

                "[_onEditSource]": [gpf.$HtmlEvent("click", "div.button.edit")],
                _onEditSource: function (event) {
                    var
                        text = document.querySelector(".text"),
                        textarea = text.querySelector("textarea");
                    document.querySelector(".workspace")
                        .setAttribute("style", "display: none;");
                    text.setAttribute("style", "display: block;");
                    // TODO check if _source is up-to-date
                    textarea.value = this._source;
                },

                "[_onSourceEdited]": [
                    gpf.$HtmlEvent("click", "div.text div.button.save", true)
                ],
                _onSourceEdited: function (event) {
                    var
                        text = document.querySelector(".text"),
                        textarea = text.querySelector("textarea");
                    this._source = textarea.value;
                    document.querySelector(".workspace")
                        .setAttribute("style", "display: block;");
                    text.setAttribute("style", "display: none;");
                },

                "[_onSwitchView]": [
                    gpf.$HtmlEvent("click", "div.footer div.button.key", true)
                ],
                _onSwitchView: function (event) {
                    if (this._displayed) {

                    } else {

                    }
                    this._displayed = !this._displayed;
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

    var source = new Source();
    gpf.html.handle(source, "#source");
    var domTemplate = gpf.html.handle(new Key(), ".box.unselected.key");
    Key.template = domTemplate.cloneNode(true);

});
