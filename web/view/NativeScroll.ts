import {NativeView} from "../view/NativeView";

export class NativeScroll extends NativeView {

    _canvas: HTMLElement
    _posX: number = 0
    _posXMax: number = 0
    _posY: number = 0
    _posYMax: number = 0
    _content: Element;

    create() {
        this._captureMode = "b";

        let e = document.createElement("div");
        e.style.overflow = "hidden";
        e.style.pointerEvents = "auto";

        this._canvas = document.createElement("div");
        this._canvas.style.overflow = "visible";
        this._canvas.style.position = "absolute";

        return e;
    }

    layoutChildren() {
        // this is when we can get the size of our content and re-attach it to canvas
        // we should have only 1 child - let move it from being a direct child to being on our canvas
        if (this._e.childElementCount == 1 && this._content === undefined) {
            this._content = this._e.children[0];
            this._canvas.appendChild(this._content);
            this._e.appendChild(this._canvas);
            this._bFling = true;
        }

        // force to be vertical only, since that's what Android ScrollView can do
        this._posXMax = 0;
        this._posYMax = this._content.clientHeight - this._e.clientHeight;

        console.log("posYMax: " + this._posXMax);
    }

    clampTrunc(n: number, min: number, max: number)
    {
        return Math.trunc(Math.max(min, Math.min(max, n)));
    }

    scrollTo(x: number, y: number, bAnimate: boolean) {
        this._posX = this.clampTrunc(x, -this._posXMax, 0);
        this._posY = this.clampTrunc(y, -this._posYMax, 0);


        // move the canvas
        this._canvas.style.transitionProperty = bAnimate ? "left top" : null;
        this._canvas.style.transitionDuration = bAnimate ? "400ms" : null;
        this._canvas.style.transitionTimingFunction = bAnimate ? "ease" : null;
        this._canvas.style.left = this._posX + "px";
        this._canvas.style.top = this._posY + "px";
    }

    onFling(vx: number, vy: number, mag: number) {

        // too slow without multiplier
        vx*=10;
        vy*=10;

        this.scrollTo(this._posX+vx, this._posY+vy, true);
    }

    onMove(x: number, y: number, dx: number, dy: number) {
        this.scrollTo(this._posX+dx, this._posY+dy, false);
    }
}
