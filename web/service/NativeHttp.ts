import {Native} from "../platform/Native";

export class NativeHttp {

    _native: Native;

    constructor(native: Native) {
        this._native = native;
    }

    send(dataStr: string) {

        var data = JSON.parse(dataStr);

        fetch(data._url, {
            headers: data._headers,
            method: data._verb,
            body: data._body
        })
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                // success
                this._native._store.setRaw(data._storeId, json);
                this._native.jsCall(data._viewId, data._onSuccess)
            }).catch((error) => {
                // error
                this._native.jsCall(data._viewId, data._onError, error)
            })
    }
}
