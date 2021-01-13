import {NativeView} from "./NativeView";

export class NativeImage extends NativeView {
    create() {
        let e = document.createElement("div");
        return e;
    }

    url(url: string) {
        this._e.style.backgroundImage = "url(" + url + ")";
        this._e.style.backgroundSize = "100% 100%";
    }
}