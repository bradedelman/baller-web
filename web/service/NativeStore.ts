export class NativeStore {

    _data: Map<string, object> = new Map();

    set(key: string, value: string) {
        // has to be stringified to cross the boundary, but we store it as JSON, since usually read using getFromJSON
        this._data.set(key, JSON.parse(value));
    }

    get(key: string) {
        // has to be stringified to cross the boundary
        return JSON.stringify(this._data.get(key));
    }

    setRaw(key: string, value: Object) {
        // way to pass in non-Stringified from native code
        this._data.set(key, value);
    }

    getArrayCount(key: string, payloadStr: string) {
        var o = this.getCore(key, payloadStr);
        return o["length"];
    }

    getFromJSON(key: string, payloadStr: string) {
        return JSON.stringify(this.getCore(key, payloadStr));
    }

    getCore(key: string, payloadStr: string) {
        var payload = JSON.parse(payloadStr);
        var path = payload._path;
        var args = payload._args;

        var o = this._data.get(key);
        var result = null;

        var dot = 0;
        while (dot != -1 && o) { // keep going if more dots or found nothing
            dot = path.indexOf(".");
            var c = path.substring(0, dot == -1 ? path.length : dot);
            var j = c.indexOf("[");
            if (j != -1) {
                // indexing into array
                var k = c.indexOf("]");
                var index = c.substring(j+1, k);
                var c = c.substring(0, j);
                index = index.trim();
                var n;
                if (index[0] === "$") {
                    // it's a variable!
                    var v = parseInt(index.substring(1));
                    n = args[v-1];
                } else {
                    n = parseInt(index);
                }
                o = o[c][n];
            } else {
                // indexing to non-array
                o = o[c];
            }
            path = path.substring(dot+1);
        }
        return o;
    }


}