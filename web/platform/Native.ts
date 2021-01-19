import {NativeInterface} from './NativeInterface';
import {NativeView} from "../view/NativeView";
import {NativeDiv} from "../view/NativeDiv";
import {NativeImage} from "../view/NativeImage";
import {NativeLabel} from "../view/NativeLabel";
import {NativeList} from "../view/NativeList";
import {NativeHttp} from "../service/NativeHttp";
import {NativeStore} from "../service/NativeStore";
import {NativeFont} from "../platform/NativeFont";
import {NativeField} from "../view/NativeField";
import {NativeScroll} from "../view/NativeScroll";
import {NativeButton} from "../view/NativeButton";
import {NativeHost} from "../service/NativeHost";

export class Native implements NativeInterface {

    _types:Map<string, object> = new Map();
    _views:Map<string,NativeView> = new Map();
    _services:Map<string,object> = new Map();
    _nativeId: string;
    _store: NativeStore = new NativeStore();
    _fonts = new NativeFont();
    _scaledWidth: number;
    
    constructor(nativeId, scaledWidth)
	{
	    this._nativeId = nativeId;
        this._scaledWidth = scaledWidth;

	    // be nice if this was less manual / omission prone
        // might be necessary, since without the explicit imports and use the typescript compiler won't include them? (or maybe that can be forced?)
        this._types.set("NativeView", NativeView);
        this._types.set("NativeDiv", NativeDiv);
        this._types.set("NativeImage", NativeImage);
        this._types.set("NativeLabel", NativeLabel);
        this._types.set("NativeList", NativeList);
        this._types.set("NativeField", NativeField);
        this._types.set("NativeScroll", NativeScroll);
        this._types.set("NativeButton", NativeButton);

    }

    addServices()
    {
        // register non-View APIs
        this._services.set("NativeHttp", new NativeHttp(this));
        this._services.set("NativeStore", this._store);
        this._services.set("NativeHost", new NativeHost(this));
    }

    jsCreate(jsTypeId: string, parentId: string = null):NativeView
    {
        // @ts-ignore
        let viewId = Baller.create(this._nativeId, jsTypeId, parentId);
        let nv = this._views.get(viewId);
        return nv;
    }

    jsCall(id: string, method: string, ...args: any[]):any
    {
        // @ts-ignore
        return Baller.call(this._nativeId, id, method, ...args);
    }

    call6(id: string, method: string, a: Object, b: Object, c: Object, d: Object, e: Object, f: Object)
    {
        let v = this._views.get(id);
        return v[method](a ,b, c, d, e, f);
    }

    call5(id: string, method: string, a: Object, b: Object, c: Object, d: Object, e: Object)
    {
        let v = this._views.get(id);
        return v[method](a ,b, c, d, e);
    }

    call4(id: string, method: string, a: Object, b: Object, c: Object, d: Object)
    {
        let v = this._views.get(id);
        return v[method](a ,b, c, d);
    }

    call3(id: string, method: string, a: Object, b: Object, c: Object)
    {
        let v = this._views.get(id);
        return v[method](a ,b, c);
    }

    call2(id: string, method: string, a: Object, b: Object)
    {
        let v = this._views.get(id);
        return v[method](a ,b);
    }

    call1(id: string, method: string, a: Object)
    {
        let v = this._views.get(id);
        return v[method](a);
    }

    call0(id: string, method: string)
    {
        let v = this._views.get(id);
        return v[method]();
    }

    callAPI2(apiName: string, method: string, a: Object, b: Object)
    {
        let api = this._services.get(apiName);
        return api[method](a, b);
    }

    callAPI1(apiName: string, method: string, a: Object)
    {
        let api = this._services.get(apiName);
        return api[method](a);
    }

}
