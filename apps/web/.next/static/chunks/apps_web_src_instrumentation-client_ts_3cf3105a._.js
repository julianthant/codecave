(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/apps/web/src/instrumentation-client.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
__turbopack_context__.s({
    "onRouterTransitionStart": ()=>onRouterTransitionStart
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$9$2e$40$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$1$2e$30$2e$1_$40$opentelemetry$2b$core$40$1$2e$30$2e$1_$40$o_ovgtxusigv557lxw7cjbgcwlnu$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@sentry+nextjs@9.40.0_@opentelemetry+context-async-hooks@1.30.1_@opentelemetry+core@1.30.1_@o_ovgtxusigv557lxw7cjbgcwlnu/node_modules/@sentry/nextjs/build/esm/client/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2d$internal$2b$replay$40$9$2e$40$2e$0$2f$node_modules$2f40$sentry$2d$internal$2f$replay$2f$build$2f$npm$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@sentry-internal+replay@9.40.0/node_modules/@sentry-internal/replay/build/npm/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$9$2e$40$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$1$2e$30$2e$1_$40$opentelemetry$2b$core$40$1$2e$30$2e$1_$40$o_ovgtxusigv557lxw7cjbgcwlnu$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$client$2f$routing$2f$appRouterRoutingInstrumentation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@sentry+nextjs@9.40.0_@opentelemetry+context-async-hooks@1.30.1_@opentelemetry+core@1.30.1_@o_ovgtxusigv557lxw7cjbgcwlnu/node_modules/@sentry/nextjs/build/esm/client/routing/appRouterRoutingInstrumentation.js [app-client] (ecmascript)");
globalThis["_sentryRouteManifest"] = "{\"dynamicRoutes\":[],\"staticRoutes\":[{\"path\":\"/\"},{\"path\":\"/sentry-example-page\"}]}";
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$9$2e$40$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$1$2e$30$2e$1_$40$opentelemetry$2b$core$40$1$2e$30$2e$1_$40$o_ovgtxusigv557lxw7cjbgcwlnu$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["init"]({
    dsn: "https://b58a3f33eca1869cd4cc0a2b79dd589f@o4509683568148480.ingest.us.sentry.io/4509683569262592",
    // Add optional integrations for additional features
    integrations: [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2d$internal$2b$replay$40$9$2e$40$2e$0$2f$node_modules$2f40$sentry$2d$internal$2f$replay$2f$build$2f$npm$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replayIntegration"]()
    ],
    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,
    // Define how likely Replay events are sampled.
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0,
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false
});
const onRouterTransitionStart = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$9$2e$40$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$1$2e$30$2e$1_$40$opentelemetry$2b$core$40$1$2e$30$2e$1_$40$o_ovgtxusigv557lxw7cjbgcwlnu$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$client$2f$routing$2f$appRouterRoutingInstrumentation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["captureRouterTransitionStart"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=apps_web_src_instrumentation-client_ts_3cf3105a._.js.map