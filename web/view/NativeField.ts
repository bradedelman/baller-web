import {NativeView} from "./NativeView";

export class NativeField extends NativeView {
    create() {
        let e = document.createElement("input");
        return e;
    }

    text(text: string) {
        this._e["value"] = text;
    }

    value() {
        return this._e["value"];
    }

    fontFace(url: string, bSystem: boolean) {
        if (bSystem) {
            url = "https://www.cleverfocus.com/baller/" + url;
        }
        this._e.style.fontFamily = this._native._fonts.getFont(url);
    }

    fontSize(size: number) {
        this._e.style.fontSize = size+"px";
    }
}