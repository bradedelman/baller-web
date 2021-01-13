import {Native} from "../platform/Native";

export class NativeHost {

    _native: Native;

    constructor(native: Native) {
        this._native = native;
    }

    onEvent(naem: string, value: any) {
        var e = document.getElementById(this._native._nativeId);
        if (e["onEvent"]) {
            e["onEvent"](name, value);
        }
    }

    create(nativeType: string, id: string)
    {
        // @ts-ignore
        let v = this._native._types.get(nativeType).New(this._native);
        v._id = id;
        this._native._views.set(id, v);
    }

    addChild(parentId: string, childId: string)
    {
        let parent = this._native._views.get(parentId);
        let child = this._native._views.get(childId);
        parent._e.appendChild(child._e);
    }

    finishInit(nativeType: string)
    {
        let nv = this._native.jsCreate(nativeType);

        // for web platform, the native Id is the element ID for the root
        let p = document.getElementById(this._native._nativeId);
        p.appendChild(nv._e);

        // apply scaling
        var realWidth = p.clientWidth;
        var scale = realWidth/this._native._scaledWidth;
        var t = "scale(" + scale + ")";
        nv._e.style.transform = t;
        nv._e.style.transformOrigin = "top left";

        nv.jsCall("doLayout", this._native._scaledWidth, p.clientHeight/scale);
    }
}