import {Native} from "../platform/Native";

type StaticThis<T> = { new (context: any): T };

export class NativeView {
    _e: HTMLElement
    _id: string
    _native: Native
    _x: number
    _y: number
    _width: number
    _height: number
    _bFling: boolean

    static New<T extends NativeView>(this: StaticThis<T>, native: Native) {
        const that = new this(native);
        let e = that.create();
        that._native = native;
        that.setHTMLElement(e);
        return that;
    }

    constructor(native: Native) {
        this._native = native;
        this._bFling = false;
    }

    create() {
        return null;
    }

    jsCall(method: string, ...args: any[]) {
        return this._native.jsCall(this._id, method, ...args);
    }

    width()
    {
        return this._width
    }

    height() {
        return this._height
    }

    setBounds(x: number, y: number, w: number, h: number) {
        this._e.style.position = "absolute";
        this._e.style.left = x + "px";
        this._e.style.top = y + "px";
        this._e.style.width = w + "px";
        this._e.style.height = h + "px";
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
    }

    _bDown : boolean = false
    _bMoved : boolean = false
    _lastX : number = 0
    _lastY : number = 0
    _lastDX : number = 0
    _lastDY : number = 0
    _captureMode: string = "n";  // n= none, h= if start to move horizontally, v= if start to move vertically, b= if start to move either direction

    static _gbCapturing: NativeView = null;
    static _gbDown: NativeView[] = [];

    setHTMLElement(e: HTMLElement) {
        this._e = e;

        this._e.addEventListener("pointerdown", (event)=>{
            this._bDown = true;
            this._bMoved = false;
            this._lastX = event.x;
            this._lastY = event.y;
            this._lastDX = 0;
            this._lastDY = 0;
            this.onDown(event.x, event.y);
            NativeView._gbDown.push(this);
        });

        this._e.addEventListener("pointermove", (event)=>{
            if (this._bDown) {
                this._bMoved = true;
                this._lastDX = event.x - this._lastX;
                this._lastDY = event.y - this._lastY;
                this._lastX = event.x;
                this._lastY = event.y;
                this.onMove(event.x, event.y, this._lastDX, this._lastDY);

                if (!NativeView._gbCapturing) {
                    var bCapture = false;
                    switch (this._captureMode) {
                        case "h":
                            if (Math.abs(this._lastDX) > Math.abs(this._lastDY)) bCapture = true;
                            break;
                        case "v":
                            if (Math.abs(this._lastDX) >= Math.abs(this._lastDX)) bCapture = true;
                            break; // if equal, favor vertical
                        case "b":
                            bCapture = true;
                    }
                    if (bCapture) {
                        NativeView._gbCapturing = this;
                        this._e.setPointerCapture(event.pointerId)

                        // clear down elements... keeping only the capturing element in the down sate
                        while (NativeView._gbDown.length) {
                            var other = NativeView._gbDown.pop();
                            if (other !== this) {
                                other._bDown = false;
                                other.onUp(other._lastX, other._lastY);
                            }
                        }
                    } else {
                        // if we got a move event that we ignored due to capture mode, we need to
                        // synthesize up event
                        this._bDown = false;
                        this.onUp(this._lastX, this._lastY);
                    }
                }
            }
        });

        this._e.addEventListener("pointerup", (event)=>{
            if (NativeView._gbCapturing === this) {
                NativeView._gbCapturing = null;
                this._e.releasePointerCapture(event.pointerId);
            }
            this._bDown = false;
            if (!this._bMoved || !this._bFling) {
                this.onUp(event.x, event.y);
            } else {
                let mag = Math.sqrt(this._lastDX*this._lastDX + this._lastDY*this._lastDY);
                this.onFling(this._lastDX, this._lastDY, mag);
            }
        });
    }

    onDown(x, y) {
    }

    onUp(x, y) {
    }

    onMove(x, y, dx, dy) {
    }

    onFling(vx, vy, mag) {
    }
}
