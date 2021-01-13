import {NativeCollection} from "../platform/NativeCollection";

export class NativeList extends NativeCollection {

    _viewWidth : number = 0;
    _viewHeight : number = 0;
    _bHorizontal: boolean = false;
    _count: number = 0;

    setHorizontal(bHorizontal: boolean) {
        this._bHorizontal = bHorizontal;
        this._captureMode = bHorizontal ? "h" : "v";
    }

    setViewSize(width: number, height: number) {
        this._viewWidth = width;
        this._viewHeight = height;
    }

    setCount(count: number) {
        this._count = count;
    }

    getInView(px: number, py: number, w: number, h: number) {

        if (this._bHorizontal) {
            var x = px;
            var i = -Math.floor(px/this._viewWidth);
            var s = this._viewWidth * this._count;
            var n = Math.ceil((w+1)/this._viewWidth);
            for (var k=0; k<n; k++) {
                if (i >= this._count) break;

                this.addInView(i,i*this._viewWidth, 0, this._viewWidth, this._viewHeight);
                x += this._viewWidth
                i++
            }
        } else {
            var y = py;
            var i = -Math.floor(py/this._viewHeight);
            var s = this._viewHeight * this._count;
            var n = Math.ceil((h+1)/this._viewHeight);
            for (var k=0; k<n; k++) {
                if (i >= this._count) break;

                this.addInView(i, 0, i*this._viewHeight, this._viewWidth, this._viewHeight);
                y += this._viewHeight
                i++
            }
        }

    }

    ready() {
        this._bFling = true;

        if (this._bHorizontal) {
            this.setContentSize(this._viewWidth * this._count, this._viewHeight);
        } else {
            this.setContentSize(this._viewWidth,this._viewHeight * this._count);
        }

        this.scrollTo(0, 0, false);
    }
}