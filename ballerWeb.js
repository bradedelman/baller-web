var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// NOTE: the transpiled js for this is also baked into iOS/Android client implementations
// NOTE: if this needs to change, keep in mind those copies also need to be updated
var Baller;
(function (Baller) {
    // host platform to inject func for...
    // Baller.getNative(contextId)
    var gContexts = {};
    function create(nativeId, jsTypeId, parentId) {
        return gContexts[nativeId].create(jsTypeId, parentId);
    }
    Baller.create = create;
    function call(nativeId, id, method) {
        var _a;
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return (_a = gContexts[nativeId]).call.apply(_a, __spreadArrays([id, method], args));
    }
    Baller.call = call;
    function init(script, nativeId) {
        // @ts-ignore
        require([script], function (index) {
            // @ts-ignore
            var native = Baller.getNative(nativeId);
            var context = new index.Context(native);
            gContexts[nativeId] = context;
            var viewTypeId = context.registerViewType(index["MainView"]);
            // allows for the require to be async (can't pass in completion func across native->js boundary - this is closest thing)
            native.callAPI1("NativeHost", "finishInit", viewTypeId);
        });
    }
    Baller.init = init;
})(Baller || (Baller = {}));
function BallerView(root, script, scaledWidth)
{
    // remove .js
    script = script.substring(0, script.length-3);

    require(["platform/Native"], function(native) {
        Baller.getNative = function (contextId) {
            var result = new native.Native(contextId, scaledWidth);
            result.addServices(); // slightly different here than iOS/Android to avoid need to export services from every MainView
            return result;
        }

        Baller.init(script, root);
    });

    return document.getElementById(root);
}var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("platform/NativeInterface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("view/NativeView", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeView = void 0;
    var NativeView = /** @class */ (function () {
        function NativeView(native) {
            this._bDown = false;
            this._bMoved = false;
            this._lastX = 0;
            this._lastY = 0;
            this._lastDX = 0;
            this._lastDY = 0;
            this._captureMode = "n"; // n= none, h= if start to move horizontally, v= if start to move vertically, b= if start to move either direction
            this._native = native;
            this._bFling = false;
        }
        NativeView.New = function (native) {
            var that = new this(native);
            var e = that.create();
            that._native = native;
            that.setHTMLElement(e);
            return that;
        };
        NativeView.prototype.create = function () {
            return null;
        };
        NativeView.prototype.jsCall = function (method) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this._native).jsCall.apply(_a, __spreadArrays([this._id, method], args));
        };
        NativeView.prototype.width = function () {
            return this._width;
        };
        NativeView.prototype.height = function () {
            return this._height;
        };
        NativeView.prototype.setBounds = function (x, y, w, h) {
            this._e.style.position = "absolute";
            this._e.style.left = x + "px";
            this._e.style.top = y + "px";
            this._e.style.width = w + "px";
            this._e.style.height = h + "px";
            this._x = x;
            this._y = y;
            this._width = w;
            this._height = h;
        };
        NativeView.prototype.setHTMLElement = function (e) {
            var _this = this;
            this._e = e;
            this._e.addEventListener("pointerdown", function (event) {
                _this._bDown = true;
                _this._bMoved = false;
                _this._lastX = event.x;
                _this._lastY = event.y;
                _this._lastDX = 0;
                _this._lastDY = 0;
                _this.onDown(event.x, event.y);
                NativeView._gbDown.push(_this);
            });
            this._e.addEventListener("pointermove", function (event) {
                if (_this._bDown) {
                    _this._bMoved = true;
                    _this._lastDX = event.x - _this._lastX;
                    _this._lastDY = event.y - _this._lastY;
                    _this._lastX = event.x;
                    _this._lastY = event.y;
                    _this.onMove(event.x, event.y, _this._lastDX, _this._lastDY);
                    if (!NativeView._gbCapturing) {
                        var bCapture = false;
                        switch (_this._captureMode) {
                            case "h":
                                if (Math.abs(_this._lastDX) > Math.abs(_this._lastDY))
                                    bCapture = true;
                                break;
                            case "v":
                                if (Math.abs(_this._lastDX) >= Math.abs(_this._lastDX))
                                    bCapture = true;
                                break; // if equal, favor vertical
                            case "b":
                                bCapture = true;
                        }
                        if (bCapture) {
                            NativeView._gbCapturing = _this;
                            _this._e.setPointerCapture(event.pointerId);
                            // clear down elements... keeping only the capturing element in the down sate
                            while (NativeView._gbDown.length) {
                                var other = NativeView._gbDown.pop();
                                if (other !== _this) {
                                    other._bDown = false;
                                    other.onUp(other._lastX, other._lastY);
                                }
                            }
                        }
                        else {
                            // if we got a move event that we ignored due to capture mode, we need to
                            // synthesize up event
                            _this._bDown = false;
                            _this.onUp(_this._lastX, _this._lastY);
                        }
                    }
                }
            });
            this._e.addEventListener("pointerup", function (event) {
                if (NativeView._gbCapturing === _this) {
                    NativeView._gbCapturing = null;
                    _this._e.releasePointerCapture(event.pointerId);
                }
                _this._bDown = false;
                if (!_this._bMoved || !_this._bFling) {
                    _this.onUp(event.x, event.y);
                }
                else {
                    var mag = Math.sqrt(_this._lastDX * _this._lastDX + _this._lastDY * _this._lastDY);
                    _this.onFling(_this._lastDX, _this._lastDY, mag);
                }
            });
        };
        NativeView.prototype.onDown = function (x, y) {
        };
        NativeView.prototype.onUp = function (x, y) {
        };
        NativeView.prototype.onMove = function (x, y, dx, dy) {
        };
        NativeView.prototype.onFling = function (vx, vy, mag) {
        };
        NativeView._gbCapturing = null;
        NativeView._gbDown = [];
        return NativeView;
    }());
    exports.NativeView = NativeView;
});
define("view/NativeDiv", ["require", "exports", "view/NativeView"], function (require, exports, NativeView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeDiv = void 0;
    var NativeDiv = /** @class */ (function (_super) {
        __extends(NativeDiv, _super);
        function NativeDiv() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NativeDiv.prototype.create = function () {
            var e = document.createElement("div");
            return e;
        };
        NativeDiv.prototype.onUp = function () {
            this.jsCall("onUp");
        };
        NativeDiv.prototype.setBgColor = function (color) {
            this._e.style.backgroundColor = color;
        };
        return NativeDiv;
    }(NativeView_1.NativeView));
    exports.NativeDiv = NativeDiv;
});
define("view/NativeImage", ["require", "exports", "view/NativeView"], function (require, exports, NativeView_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeImage = void 0;
    var NativeImage = /** @class */ (function (_super) {
        __extends(NativeImage, _super);
        function NativeImage() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NativeImage.prototype.create = function () {
            var e = document.createElement("div");
            return e;
        };
        NativeImage.prototype.url = function (url) {
            this._e.style.backgroundImage = "url(" + url + ")";
            this._e.style.backgroundSize = "100% 100%";
        };
        return NativeImage;
    }(NativeView_2.NativeView));
    exports.NativeImage = NativeImage;
});
define("view/NativeLabel", ["require", "exports", "view/NativeView"], function (require, exports, NativeView_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeLabel = void 0;
    var NativeLabel = /** @class */ (function (_super) {
        __extends(NativeLabel, _super);
        function NativeLabel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NativeLabel.prototype.create = function () {
            var e = document.createElement("div");
            e.style.userSelect = "none";
            // these are needed in Safari to prevent text selection and I-Beam cursor when dragging
            e.style.webkitUserSelect = "none";
            e.style.cursor = 'default';
            e.onselectstart = function () { return false; };
            return e;
        };
        NativeLabel.prototype.text = function (text) {
            this._e.innerText = text;
        };
        NativeLabel.prototype.fontFace = function (url, bSystem) {
            if (bSystem) {
                url = "https://www.cleverfocus.com/baller/" + url;
            }
            this._e.style.fontFamily = this._native._fonts.getFont(url);
        };
        NativeLabel.prototype.fontSize = function (size) {
            this._e.style.fontSize = size + "px";
        };
        return NativeLabel;
    }(NativeView_3.NativeView));
    exports.NativeLabel = NativeLabel;
});
define("platform/NativeCollection", ["require", "exports", "view/NativeView"], function (require, exports, NativeView_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeCollection = void 0;
    var Rect = /** @class */ (function () {
        function Rect() {
        }
        return Rect;
    }());
    var NativeCollection = /** @class */ (function (_super) {
        __extends(NativeCollection, _super);
        function NativeCollection() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._activeViews = new Map();
            _this._recycleViews = [];
            _this._toRemove = new Set();
            _this._inView = new Map();
            _this._posX = 0;
            _this._contentWidth = undefined;
            _this._posY = 0;
            _this._contentHeight = undefined;
            _this._viewTypeId = 0;
            return _this;
        }
        NativeCollection.prototype.create = function () {
            this._captureMode = "b";
            var e = document.createElement("div");
            e.style.overflow = "hidden";
            e.style.pointerEvents = "auto";
            this._canvas = document.createElement("div");
            this._canvas.style.overflow = "visible";
            this._canvas.style.position = "absolute";
            e.appendChild(this._canvas);
            return e;
        };
        NativeCollection.prototype.setHTMLElement = function (e) {
            _super.prototype.setHTMLElement.call(this, e);
        };
        NativeCollection.prototype.setViewType = function (viewTypeId) {
            this._viewTypeId = viewTypeId;
        };
        NativeCollection.prototype.setContentSize = function (w, h) {
            this._contentWidth = w;
            this._contentHeight = h;
        };
        NativeCollection.prototype.getView = function (i) {
            var v = this._activeViews.get(i);
            if (!v) {
                if (this._recycleViews.length > 0) {
                    v = this._recycleViews.pop();
                }
                else {
                    // @ts-ignore
                    v = this._native.jsCreate(this._viewTypeId, this._id);
                }
                // POPULATE
                v.jsCall("onPopulate", i, this._id);
                // ADD TO CANVAS
                this._canvas.appendChild(v._e);
            }
            return v;
        };
        NativeCollection.prototype.addInView = function (i, x, y, w, h) {
            var r = new Rect();
            r.x = x;
            r.y = y;
            r.w = w;
            r.h = h;
            this._inView.set(i, r);
        };
        NativeCollection.prototype.getInView = function (px, py, w, h) {
            // FOR SUBCLASS... no need to generate *all* rectangles... can be done in a variety of ways
            // this way works well for grids, lists
        };
        NativeCollection.prototype.remove = function () {
            var _this = this;
            this._toRemove.forEach(function (i) {
                var v = _this._activeViews.get(i);
                _this._activeViews.delete(i);
                v._e.remove();
                _this._recycleViews.push(v);
            });
            this._toRemove.clear();
        };
        NativeCollection.prototype.clampTrunc = function (n, min, max) {
            return Math.trunc(Math.max(min, Math.min(max, n)));
        };
        NativeCollection.prototype.setBounds = function (x, y, w, h) {
            _super.prototype.setBounds.call(this, x, y, w, h);
            // when our bounds change, be sure correct children shown
            this.scrollTo(this._posX, this._posY, false);
        };
        NativeCollection.prototype.scrollTo = function (x, y, bAnimate) {
            var _this = this;
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
            this._activeViews.forEach(function (v, i) {
                if (!_this._inView.has(i)) {
                    _this._toRemove.add(i);
                }
            });
            // add items that aren't here
            this._inView.forEach(function (r, i) {
                if (!_this._activeViews.has(i)) {
                    var v = _this.getView(i);
                    _this._activeViews.set(i, v);
                    var r_1 = _this._inView.get(i);
                    v.jsCall("doLayout", r_1.w, r_1.h);
                    v.setBounds(r_1.x, r_1.y, r_1.w, r_1.h);
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
                this._canvas.ontransitionend = function () {
                    _this.remove();
                };
            }
            else {
                this.remove();
            }
        };
        NativeCollection.prototype.onDown = function (x, y) {
            // deal with onSelect for an element
        };
        NativeCollection.prototype.onUp = function (x, y) {
            // deal with onSelect for an element
        };
        NativeCollection.prototype.onFling = function (vx, vy, mag) {
            // too slow without multiplier
            vx *= 10;
            vy *= 10;
            // do just 1 direction
            if (Math.abs(vx) > Math.abs(vy)) {
                vy = 0;
            }
            else {
                vx = 0;
            }
            // for Web version - never fling more than a full screen width or height -- that way
            // we can use css transitions and not need to recalculate visible items while animating
            var w = this.width();
            var h = this.height();
            vx = this.clampTrunc(vx, -w, w);
            vy = this.clampTrunc(vy, -h, h);
            this.scrollTo(this._posX + vx, this._posY + vy, true);
        };
        NativeCollection.prototype.onMove = function (x, y, dx, dy) {
            this.scrollTo(this._posX + dx, this._posY + dy, false);
        };
        return NativeCollection;
    }(NativeView_4.NativeView));
    exports.NativeCollection = NativeCollection;
});
define("view/NativeList", ["require", "exports", "platform/NativeCollection"], function (require, exports, NativeCollection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeList = void 0;
    var NativeList = /** @class */ (function (_super) {
        __extends(NativeList, _super);
        function NativeList(native) {
            var _this = _super.call(this, native) || this;
            _this._viewWidth = 0;
            _this._viewHeight = 0;
            _this._bHorizontal = false;
            _this._count = 0;
            _this._captureMode = "v";
            return _this;
        }
        NativeList.prototype.setHorizontal = function (bHorizontal) {
            this._bHorizontal = bHorizontal;
            this._captureMode = bHorizontal ? "h" : "v";
        };
        NativeList.prototype.setViewSize = function (width, height) {
            this._viewWidth = width;
            this._viewHeight = height;
        };
        NativeList.prototype.setCount = function (count) {
            this._count = count;
        };
        NativeList.prototype.getInView = function (px, py, w, h) {
            if (this._bHorizontal) {
                var x = px;
                var i = -Math.floor(px / this._viewWidth);
                var s = this._viewWidth * this._count;
                var n = Math.ceil((w + 1) / this._viewWidth);
                for (var k = 0; k < n; k++) {
                    if (i >= this._count)
                        break;
                    this.addInView(i, i * this._viewWidth, 0, this._viewWidth, this._viewHeight);
                    x += this._viewWidth;
                    i++;
                }
            }
            else {
                var y = py;
                var i = -Math.floor(py / this._viewHeight);
                var s = this._viewHeight * this._count;
                var n = Math.ceil((h + 1) / this._viewHeight);
                for (var k = 0; k < n; k++) {
                    if (i >= this._count)
                        break;
                    this.addInView(i, 0, i * this._viewHeight, this._viewWidth, this._viewHeight);
                    y += this._viewHeight;
                    i++;
                }
            }
        };
        NativeList.prototype.ready = function () {
            this._bFling = true;
            if (this._bHorizontal) {
                this.setContentSize(this._viewWidth * this._count, this._viewHeight);
            }
            else {
                this.setContentSize(this._viewWidth, this._viewHeight * this._count);
            }
            this.scrollTo(0, 0, false);
        };
        return NativeList;
    }(NativeCollection_1.NativeCollection));
    exports.NativeList = NativeList;
});
define("service/NativeHttp", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeHttp = void 0;
    var NativeHttp = /** @class */ (function () {
        function NativeHttp(native) {
            this._native = native;
        }
        NativeHttp.prototype.send = function (dataStr) {
            var _this = this;
            var data = JSON.parse(dataStr);
            fetch(data._url, {
                headers: data._headers,
                method: data._verb,
                body: data._body
            })
                .then(function (response) {
                return response.json();
            })
                .then(function (json) {
                // success
                _this._native._store.setRaw(data._storeId, json);
                _this._native.jsCall(data._viewId, data._onSuccess);
            }).catch(function (error) {
                // error
                _this._native.jsCall(data._viewId, data._onError, error);
            });
        };
        return NativeHttp;
    }());
    exports.NativeHttp = NativeHttp;
});
define("service/NativeStore", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeStore = void 0;
    var NativeStore = /** @class */ (function () {
        function NativeStore() {
            this._data = new Map();
        }
        NativeStore.prototype.set = function (key, value) {
            // has to be stringified to cross the boundary, but we store it as JSON, since usually read using getFromJSON
            this._data.set(key, JSON.parse(value));
        };
        NativeStore.prototype.get = function (key) {
            // has to be stringified to cross the boundary
            return JSON.stringify(this._data.get(key));
        };
        NativeStore.prototype.setRaw = function (key, value) {
            // way to pass in non-Stringified from native code
            this._data.set(key, value);
        };
        NativeStore.prototype.getArrayCount = function (key, payloadStr) {
            var o = this.getCore(key, payloadStr);
            return o["length"];
        };
        NativeStore.prototype.getFromJSON = function (key, payloadStr) {
            return JSON.stringify(this.getCore(key, payloadStr));
        };
        NativeStore.prototype.getCore = function (key, payloadStr) {
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
                    var index = c.substring(j + 1, k);
                    var c = c.substring(0, j);
                    index = index.trim();
                    var n;
                    if (index[0] === "$") {
                        // it's a variable!
                        var v = parseInt(index.substring(1));
                        n = args[v - 1];
                    }
                    else {
                        n = parseInt(index);
                    }
                    o = o[c][n];
                }
                else {
                    // indexing to non-array
                    o = o[c];
                }
                path = path.substring(dot + 1);
            }
            return o;
        };
        return NativeStore;
    }());
    exports.NativeStore = NativeStore;
});
define("platform/NativeFont", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeFont = void 0;
    var NativeFont = /** @class */ (function () {
        function NativeFont() {
            this._fontNames = new Map();
        }
        NativeFont.prototype.getFont = function (url) {
            var name = this._fontNames.get(url);
            if (!name) {
                name = "font" + NativeFont._gNextFontId++;
                // @ts-ignore
                var font = new FontFace(name, 'url(' + url + ')');
                font.load().then(function (loadedFace) {
                    // @ts-ignore
                    document.fonts.add(loadedFace);
                });
                this._fontNames.set(url, name);
            }
            return name;
        };
        // must be global in the browser, since the font space is global
        NativeFont._gNextFontId = 1;
        return NativeFont;
    }());
    exports.NativeFont = NativeFont;
});
define("view/NativeField", ["require", "exports", "view/NativeView"], function (require, exports, NativeView_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeField = void 0;
    var NativeField = /** @class */ (function (_super) {
        __extends(NativeField, _super);
        function NativeField() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NativeField.prototype.create = function () {
            var e = document.createElement("input");
            return e;
        };
        NativeField.prototype.text = function (text) {
            this._e["value"] = text;
        };
        NativeField.prototype.value = function () {
            return this._e["value"];
        };
        NativeField.prototype.fontFace = function (url, bSystem) {
            if (bSystem) {
                url = "https://www.cleverfocus.com/baller/" + url;
            }
            this._e.style.fontFamily = this._native._fonts.getFont(url);
        };
        NativeField.prototype.fontSize = function (size) {
            this._e.style.fontSize = size + "px";
        };
        return NativeField;
    }(NativeView_5.NativeView));
    exports.NativeField = NativeField;
});
define("view/NativeScroll", ["require", "exports", "view/NativeView"], function (require, exports, NativeView_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeScroll = void 0;
    var NativeScroll = /** @class */ (function (_super) {
        __extends(NativeScroll, _super);
        function NativeScroll() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._posX = 0;
            _this._posXMax = 0;
            _this._posY = 0;
            _this._posYMax = 0;
            return _this;
        }
        NativeScroll.prototype.create = function () {
            this._captureMode = "b";
            var e = document.createElement("div");
            e.style.overflow = "hidden";
            e.style.pointerEvents = "auto";
            this._canvas = document.createElement("div");
            this._canvas.style.overflow = "visible";
            this._canvas.style.position = "absolute";
            return e;
        };
        NativeScroll.prototype.layoutChildren = function () {
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
        };
        NativeScroll.prototype.clampTrunc = function (n, min, max) {
            return Math.trunc(Math.max(min, Math.min(max, n)));
        };
        NativeScroll.prototype.scrollTo = function (x, y, bAnimate) {
            this._posX = this.clampTrunc(x, -this._posXMax, 0);
            this._posY = this.clampTrunc(y, -this._posYMax, 0);
            // move the canvas
            this._canvas.style.transitionProperty = bAnimate ? "left top" : null;
            this._canvas.style.transitionDuration = bAnimate ? "400ms" : null;
            this._canvas.style.transitionTimingFunction = bAnimate ? "ease" : null;
            this._canvas.style.left = this._posX + "px";
            this._canvas.style.top = this._posY + "px";
        };
        NativeScroll.prototype.onFling = function (vx, vy, mag) {
            // too slow without multiplier
            vx *= 10;
            vy *= 10;
            this.scrollTo(this._posX + vx, this._posY + vy, true);
        };
        NativeScroll.prototype.onMove = function (x, y, dx, dy) {
            this.scrollTo(this._posX + dx, this._posY + dy, false);
        };
        return NativeScroll;
    }(NativeView_6.NativeView));
    exports.NativeScroll = NativeScroll;
});
define("view/NativeButton", ["require", "exports", "view/NativeView"], function (require, exports, NativeView_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeButton = void 0;
    var NativeButton = /** @class */ (function (_super) {
        __extends(NativeButton, _super);
        function NativeButton() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NativeButton.prototype.create = function () {
            var _this = this;
            var e = document.createElement("button");
            e.onclick = function () {
                _this.jsCall("onClick");
            };
            return e;
        };
        NativeButton.prototype.text = function (text) {
            this._e.innerText = text;
        };
        NativeButton.prototype.fontFace = function (url, bSystem) {
            if (bSystem) {
                url = "https://www.cleverfocus.com/baller/" + url;
            }
            this._e.style.fontFamily = this._native._fonts.getFont(url);
        };
        NativeButton.prototype.fontSize = function (size) {
            this._e.style.fontSize = size + "px";
        };
        return NativeButton;
    }(NativeView_7.NativeView));
    exports.NativeButton = NativeButton;
});
define("service/NativeHost", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NativeHost = void 0;
    var NativeHost = /** @class */ (function () {
        function NativeHost(native) {
            this._native = native;
        }
        NativeHost.prototype.onEvent = function (naem, value) {
            var e = document.getElementById(this._native._nativeId);
            if (e["onEvent"]) {
                e["onEvent"](name, value);
            }
        };
        NativeHost.prototype.create = function (nativeType, id) {
            // @ts-ignore
            var v = this._native._types.get(nativeType).New(this._native);
            v._id = id;
            this._native._views.set(id, v);
        };
        NativeHost.prototype.addChild = function (parentId, childId) {
            var parent = this._native._views.get(parentId);
            var child = this._native._views.get(childId);
            parent._e.appendChild(child._e);
        };
        NativeHost.prototype.finishInit = function (nativeType) {
            var nv = this._native.jsCreate(nativeType);
            // for web platform, the native Id is the element ID for the root
            var p = document.getElementById(this._native._nativeId);
            p.appendChild(nv._e);
            // apply scaling
            var realWidth = p.clientWidth;
            var scale = realWidth / this._native._scaledWidth;
            var t = "scale(" + scale + ")";
            nv._e.style.transform = t;
            nv._e.style.transformOrigin = "top left";
            nv.jsCall("doLayout", this._native._scaledWidth, p.clientHeight / scale);
        };
        return NativeHost;
    }());
    exports.NativeHost = NativeHost;
});
define("platform/Native", ["require", "exports", "view/NativeView", "view/NativeDiv", "view/NativeImage", "view/NativeLabel", "view/NativeList", "service/NativeHttp", "service/NativeStore", "platform/NativeFont", "view/NativeField", "view/NativeScroll", "view/NativeButton", "service/NativeHost"], function (require, exports, NativeView_8, NativeDiv_1, NativeImage_1, NativeLabel_1, NativeList_1, NativeHttp_1, NativeStore_1, NativeFont_1, NativeField_1, NativeScroll_1, NativeButton_1, NativeHost_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Native = void 0;
    var Native = /** @class */ (function () {
        function Native(nativeId, scaledWidth) {
            this._types = new Map();
            this._views = new Map();
            this._services = new Map();
            this._store = new NativeStore_1.NativeStore();
            this._fonts = new NativeFont_1.NativeFont();
            this._nativeId = nativeId;
            this._scaledWidth = scaledWidth;
            // be nice if this was less manual / omission prone
            // might be necessary, since without the explicit imports and use the typescript compiler won't include them? (or maybe that can be forced?)
            this._types.set("NativeView", NativeView_8.NativeView);
            this._types.set("NativeDiv", NativeDiv_1.NativeDiv);
            this._types.set("NativeImage", NativeImage_1.NativeImage);
            this._types.set("NativeLabel", NativeLabel_1.NativeLabel);
            this._types.set("NativeList", NativeList_1.NativeList);
            this._types.set("NativeField", NativeField_1.NativeField);
            this._types.set("NativeScroll", NativeScroll_1.NativeScroll);
            this._types.set("NativeButton", NativeButton_1.NativeButton);
        }
        Native.prototype.addServices = function () {
            // register non-View APIs
            this._services.set("NativeHttp", new NativeHttp_1.NativeHttp(this));
            this._services.set("NativeStore", this._store);
            this._services.set("NativeHost", new NativeHost_1.NativeHost(this));
        };
        Native.prototype.jsCreate = function (jsTypeId, parentId) {
            if (parentId === void 0) { parentId = null; }
            // @ts-ignore
            var viewId = Baller.create(this._nativeId, jsTypeId, parentId);
            var nv = this._views.get(viewId);
            return nv;
        };
        Native.prototype.jsCall = function (id, method) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            // @ts-ignore
            return Baller.call.apply(Baller, __spreadArrays([this._nativeId, id, method], args));
        };
        Native.prototype.call6 = function (id, method, a, b, c, d, e, f) {
            var v = this._views.get(id);
            return v[method](a, b, c, d, e, f);
        };
        Native.prototype.call5 = function (id, method, a, b, c, d, e) {
            var v = this._views.get(id);
            return v[method](a, b, c, d, e);
        };
        Native.prototype.call4 = function (id, method, a, b, c, d) {
            var v = this._views.get(id);
            return v[method](a, b, c, d);
        };
        Native.prototype.call3 = function (id, method, a, b, c) {
            var v = this._views.get(id);
            return v[method](a, b, c);
        };
        Native.prototype.call2 = function (id, method, a, b) {
            var v = this._views.get(id);
            return v[method](a, b);
        };
        Native.prototype.call1 = function (id, method, a) {
            var v = this._views.get(id);
            return v[method](a);
        };
        Native.prototype.call0 = function (id, method) {
            var v = this._views.get(id);
            return v[method]();
        };
        Native.prototype.callAPI2 = function (apiName, method, a, b) {
            var api = this._services.get(apiName);
            return api[method](a, b);
        };
        Native.prototype.callAPI1 = function (apiName, method, a) {
            var api = this._services.get(apiName);
            return api[method](a);
        };
        return Native;
    }());
    exports.Native = Native;
});
