import {NativeView} from "../view/NativeView";

class Rect {
    x: number
    y: number
    w: number
    h: number
}
export class NativeCollection extends NativeView {

    _canvas: HTMLElement
    _activeViews: Map<number, NativeView> = new Map()
    _recycleViews: Array<NativeView> = []
    _toRemove: Set<number> = new Set()
    _inView:Map<number, Rect> = new Map();
    _posX: number = 0
    _contentWidth: number = undefined
    _posY: number = 0
    _contentHeight: number = undefined
    _viewTypeId: number = 0

    create() {
        this._captureMode = "b";

        let e = document.createElement("div");
        e.style.overflow = "hidden";
        e.style.pointerEvents = "auto";

        this._canvas = document.createElement("div");
        this._canvas.style.overflow = "visible";
        this._canvas.style.position = "absolute";

        e.appendChild(this._canvas);
        return e;
    }

    setHTMLElement(e: HTMLElement) {
        super.setHTMLElement(e);
    }

    setViewType(viewTypeId: number) {
        this._viewTypeId = viewTypeId;
    }

    setContentSize(w: number, h: number) {
        this._contentWidth = w;
        this._contentHeight = h;
    }

    getView(i: number) {
        let v:NativeView = this._activeViews.get(i);
        if (!v) {
            if (this._recycleViews.length > 0) {
                v = this._recycleViews.pop();
            } else {
                // @ts-ignore
                v = this._native.jsCreate(this._viewTypeId, this._id);
            }

            // POPULATE
            v.jsCall("onPopulate", i, this._id);

            // ADD TO CANVAS
            this._canvas.appendChild(v._e);
        }

        return v;
    }

    addInView(i: number, x: number, y: number, w: number, h: number) {
        let r: Rect = new Rect();
        r.x = x;
        r.y = y;
        r.w = w;
        r.h = h;
        this._inView.set(i, r);
    }

    getInView(px: number, py: number, w: number, h: number) {
        // FOR SUBCLASS... no need to generate *all* rectangles... can be done in a variety of ways
        // this way works well for grids, lists
    }

    remove()
    {
        this._toRemove.forEach((i)=>{
            let v = this._activeViews.get(i);
            this._activeViews.delete(i);
            v._e.remove();
            this._recycleViews.push(v);
        });
        this._toRemove.clear();
    }

    clampTrunc(n: number, min: number, max: number)
    {
        return Math.trunc(Math.max(min, Math.min(max, n)));
    }

    setBounds(x: number, y: number, w: number, h: number) {
        super.setBounds(x, y, w, h);

        // when our bounds change, be sure correct children shown
        this.scrollTo(this._posX, this._posY, false);
    }

    scrollTo(x: number, y: number, bAnimate: boolean) {

        if (this._contentWidth === undefined || this.width() === undefined) {
            return;
        }
        if (this._contentHeight === undefined || this.height() === undefined) {
            return;
        }

        var posXMax = this._contentWidth - this.width();
        var posYMax = this._contentHeight - this.height();

        this._posX = this.clampTrunc(x, -posXMax, 0);
        this._posY = this.clampTrunc(y, -posYMax, 0);

        // get what items are in view
        this.getInView(this._posX, this._posY, this.width(), this.height());

        // remove items that aren't in view anymore (any previous Set is irrelevant, since we're scrolling again before removal)
        // done on animation delay so that items don't disappear until finished scrolling out of view
        this._toRemove.clear();
        this._activeViews.forEach((v, i)=>{
            if (!this._inView.has(i)) {
                this._toRemove.add(i);
            }
        });

        // add items that aren't here
        this._inView.forEach((r, i)=>{
            if (!this._activeViews.has(i)) {
                let v = this.getView(i);
                this._activeViews.set(i, v);
                let r: Rect = this._inView.get(i);
                v.jsCall("doLayout", r.w, r.h);
                v.setBounds(r.x, r.y, r.w, r.h);
            }
        });

        // move the canvas
        this._canvas.style.transitionProperty = bAnimate ? "left top" : null;
        this._canvas.style.transitionDuration = bAnimate ? "400ms" : null;
        this._canvas.style.transitionTimingFunction = bAnimate ? "ease" : null;
        this._canvas.style.left = this._posX + "px";
        this._canvas.style.top = this._posY + "px";

        // transitionend not called if transition replaced before it ends
        if (bAnimate) {
            this._canvas.ontransitionend = () => {
                this.remove();
            };
        } else {
            this.remove();
        }
    }

    onDown(x: number, y: number) {
        // deal with onSelect for an element
    }

    onUp(x: number, y: number) {
        // deal with onSelect for an element
    }

    onFling(vx: number, vy: number, mag: number) {

        // too slow without multiplier
        vx*=10;
        vy*=10;
        
        // do just 1 direction
        if (Math.abs(vx) > Math.abs(vy)) {
            vy = 0;
        } else {
            vx = 0;
        }

        // for Web version - never fling more than a full screen width or height -- that way
        // we can use css transitions and not need to recalculate visible items while animating
        let w = this.width();
        let h = this.height();
        vx = this.clampTrunc(vx, -w, w);
        vy = this.clampTrunc(vy, -h, h);

        this.scrollTo(this._posX+vx, this._posY+vy, true);
    }

    onMove(x: number, y: number, dx: number, dy: number) {
        this.scrollTo(this._posX+dx, this._posY+dy, false);
    }
}
