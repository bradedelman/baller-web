export interface NativeInterface {
    call6(id: string, method: string, a: Object, b: Object, c: Object, d: Object, e: Object, f: Object)
    call5(id: string, method: string, a: Object, b: Object, c: Object, d: Object, e: Object)
    call4(id: string, method: string, a: Object, b: Object, c: Object, d: Object)
    call3(id: string, method: string, a: Object, b: Object, c: Object)
    call2(id: string, method: string, a: Object, b: Object)
    call1(id: string, method: string, a: Object)
    call0(id: string, method: string)

    callAPI2(apiName: string, method: string, a: Object, b: Object);
    callAPI1(apiName: string, method: string, a: Object);
}
