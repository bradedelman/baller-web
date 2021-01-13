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

    font(url: string, size: number) {
        this._e.style.fontFamily = this._native._fonts.getFont(url);
        this._e.style.fontSize = size+"px";
    }
}