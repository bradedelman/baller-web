export class NativeFont {

    // must be global in the browser, since the font space is global
    static _gNextFontId: number = 1;
    _fontNames: Map<string, string> = new Map();

    getFont(url) {

        var name = this._fontNames.get(url);
        if (!name) {
            name = "font" + NativeFont._gNextFontId++;
            // @ts-ignore
            var font = new FontFace(name, 'url(' + url + ')');
            font.load().then(function (loadedFace) {
                // @ts-ignore
                document.fonts.add(loadedFace);
            });
            this._fontNames.set(url, name);
        }

        return name;
    }
}
