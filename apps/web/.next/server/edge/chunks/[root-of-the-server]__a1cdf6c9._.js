(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__a1cdf6c9._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[project]/apps/web/sentry.edge.config.ts [instrumentation-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$9$2e$40$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$1$2e$30$2e$1_$40$opentelemetry$2b$core$40$1$2e$30$2e$1_$40$o_ovgtxusigv557lxw7cjbgcwlnu$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$edge$2f$index$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@sentry+nextjs@9.40.0_@opentelemetry+context-async-hooks@1.30.1_@opentelemetry+core@1.30.1_@o_ovgtxusigv557lxw7cjbgcwlnu/node_modules/@sentry/nextjs/build/esm/edge/index.js [instrumentation-edge] (ecmascript) <locals>");
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$9$2e$40$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$1$2e$30$2e$1_$40$opentelemetry$2b$core$40$1$2e$30$2e$1_$40$o_ovgtxusigv557lxw7cjbgcwlnu$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$edge$2f$index$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__["init"]({
    dsn: "https://b58a3f33eca1869cd4cc0a2b79dd589f@o4509683568148480.ingest.us.sentry.io/4509683569262592",
    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false
});
}),
"[project]/apps/web/src/instrumentation.ts [instrumentation-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "onRequestError": ()=>onRequestError,
    "register": ()=>register
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$9$2e$40$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$1$2e$30$2e$1_$40$opentelemetry$2b$core$40$1$2e$30$2e$1_$40$o_ovgtxusigv557lxw7cjbgcwlnu$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$common$2f$captureRequestError$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@sentry+nextjs@9.40.0_@opentelemetry+context-async-hooks@1.30.1_@opentelemetry+core@1.30.1_@o_ovgtxusigv557lxw7cjbgcwlnu/node_modules/@sentry/nextjs/build/esm/common/captureRequestError.js [instrumentation-edge] (ecmascript)");
;
async function register() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if ("TURBOPACK compile-time truthy", 1) {
        await Promise.resolve().then(()=>__turbopack_context__.i("[project]/apps/web/sentry.edge.config.ts [instrumentation-edge] (ecmascript)"));
    }
}
const onRequestError = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$9$2e$40$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$1$2e$30$2e$1_$40$opentelemetry$2b$core$40$1$2e$30$2e$1_$40$o_ovgtxusigv557lxw7cjbgcwlnu$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$common$2f$captureRequestError$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__["captureRequestError"];
}),
"[project]/apps/web/edge-wrapper.js { MODULE => \"[project]/apps/web/src/instrumentation.ts [instrumentation-edge] (ecmascript)\" } [instrumentation-edge] (ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i("[project]/apps/web/src/instrumentation.ts [instrumentation-edge] (ecmascript)"));
modProm.catch(()=>{});
self._ENTRIES["middleware_instrumentation"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__a1cdf6c9._.js.map