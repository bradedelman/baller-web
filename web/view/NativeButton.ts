import {NativeView} from "./NativeView";

export class NativeButton extends NativeView {
    create() {
        let e = document.createElement("button");
        e.onclick = () =>
        {
            this.jsCall("onClick");
        }
        return e;
    }

    text(text: string) {
        this._e.innerText = text;
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