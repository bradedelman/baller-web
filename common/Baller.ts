// NOTE: the transpiled js for this is also baked into iOS/Android client implementations
// NOTE: if this needs to change, keep in mind those copies also need to be updated
namespace Baller {

	// host platform to inject func for...
	// Baller.getNative(contextId)

	var gContexts = {};

	export function create(nativeId, jsTypeId)
	{
		return gContexts[nativeId].create(jsTypeId);
	}

	export function call(nativeId, id, method, ...args)
	{
		return gContexts[nativeId].call(id, method, ...args);
	}

	export function init(script, nativeId)
	{
        // @ts-ignore
		require([script], function(index) {
			// @ts-ignore
			var native = Baller.getNative(nativeId);
			var context = new index.Context(native);
			gContexts[nativeId] = context;
			var viewTypeId = context.registerViewType(index["MainView"]);

			// allows for the require to be async (can't pass in completion func across native->js boundary - this is closest thing)
			native.callAPI1("NativeHost", "finishInit", viewTypeId);
	  });
	}

}
