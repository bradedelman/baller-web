import {NativeView} from "./NativeView";

export class NativeLabel extends NativeView {
    create() {
        let e = document.createElement("div");
        e.style.userSelect = "none";

        // these are needed in Safari to prevent text selection and I-Beam cursor when dragging
        e.style.webkitUserSelect = "none";
        e.style.cursor = 'default';
        e.onselectstart = () => {return false};

        return e;
    }

    text(text: string) {
        this._e.innerText = text;
    }

    font(url: string, size: number) {
        this._e.style.fontFamily = this._native._fonts.getFont(url);
        this._e.style.fontSize = size+"px";
    }
}