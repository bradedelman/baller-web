function BallerView(root, script, scaledWidth)
{
    // remove .js
    script = script.substring(0, script.length-3);

    require(["platform/Native"], function(native) {
        Baller.getNative = function (contextId) {
            var result = new native.Native(contextId, scaledWidth);
            result.addServices(); // slightly different here than iOS/Android to avoid need to export services from every MainView
            return result;
        }

        Baller.init(script, root);
    });

    return document.getElementById(root);
}