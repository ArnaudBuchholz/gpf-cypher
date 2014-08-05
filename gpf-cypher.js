(function () {
    "uses strict";

    function onBrowseSource() {
        var
            browseFile = document.getElementById("sourceFile");
        if (null === browseFile) {
            var div = document.createElement("div");
            div.innerHTML = "<input type=\"file\" id=\"sourceFile\" style=\"display: none;\">";
            document.body.appendChild(div.firstChild);
            browseFile = document.getElementById("sourceFile");
            browseFile.addEventListener("change", onSourceSelected);
        }
        browseFile.click();
    }

    function onSourceSelected(event) {
        event = event || window.event;
        var file = event.target.files[0];
        alert(file.name);
    }

    function onDragOverSource(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    function onDropOnSource(event) {
        event.stopPropagation();
        event.preventDefault();
        var
            files = event.dataTransfer.files,
            len = files.length;
        alert(event.dataTransfer.files[0].name);
    }

    function init() {
        // Create a map handler, could be
/*
        gpf.html.on({
            browseSource: {
                click: onBrowseSource
            },
            source: {
                dragover: onDragOverSource,
                drop: onDropOnSource
            }
        });
*/
        document.getElementById("browseSource")
            .addEventListener("click", onBrowseSource);
        document.getElementById("source")
            .addEventListener("dragover", onDragOverSource);
        document.getElementById("source")
            .addEventListener("drop", onDropOnSource);
    }

    window.onload = init;

}());
