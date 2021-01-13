import {NativeView} from "./NativeView";

export class NativeDiv extends NativeView {

    create() {
        let e = document.createElement("div");
        return e;
    }

    onUp() {
        this.jsCall("onUp");
    }

    setBgColor(color: string) {
        this._e.style.backgroundColor = color;
    }

}
