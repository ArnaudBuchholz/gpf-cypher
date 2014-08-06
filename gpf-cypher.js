window.onlad=gpf.loaded(function () {
    "uses strict";

    var
        Box = gpf.define("Box", {

            private: {

                "[_ui]": [gpf.$HtmlHandler()],
                _ui: null,

                _fileInput: null,

                "[_onBrowse]": [gpf.$HtmlEvent("click", "div.button.file")],
                _onBrowse: function(event) {
                    if (null === this._fileInput) {
                        // TODO find a better way to achieve this
                        var div = document.createElement("div");
                        div.innerHTML = "<input type=\"file\" id=\"sourceFile\" "
                            + "style=\"display: none;\">";

                        this._fileInput = this._ui.appendChild(div.firstChild);
                        // TODO see if it can be done automatically
                        gpf.html.handle(this);
                    }
                    this._fileInput.click();
                },

                "[_onBrowsed]": [gpf.$HtmlEvent("change", "input[type=file]")],
                _onBrowsed: function (event) {
                    var file = event.target.files[0];
                    alert(file.name);
                },


                "[_onDragOver]": [gpf.$HtmlEvent("dragover")],
                _onDragOver: function (event) {
                    // Check this is a file
                    event.stopPropagation();
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'copy';
                },

                "[_onDrop]": [gpf.$HtmlEvent("drop")],
                _onDrop: function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    var
                        files = event.dataTransfer.files,
                        len = files.length;
                    alert(event.dataTransfer.files[0].name);
                }

            }
        });

    var source = new Box();
    gpf.html.handle(source, "source");

});
