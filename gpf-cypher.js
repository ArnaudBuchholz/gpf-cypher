window.onlad=gpf.loaded(function () {
    "uses strict";

    var
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

        }),

        KeySelector = gpf.define("Source", Box, {

            protected: {
                onFileSelected: function (file) {
                    this._ui.className = "box selected file";
                    this.setTitle("Size: " + file.size);
                    this.setToolbar();
                }
            }

        });

    var source = new Source();
    gpf.html.handle(source, "#source");
    var keySelector = new KeySelector();
    gpf.html.handle(keySelector, "#keySelector");

});
