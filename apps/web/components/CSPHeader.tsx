/**
 * Content Security Policy Header Component
 * Provides security headers for the application
 */
export function CSPHeader() {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  // Generate a nonce for inline scripts (in production)
  const nonce = !isDevelopment ? generateNonce() : undefined;
  
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://vercel.live https://vitals.vercel-insights.com wss: ws:",
    "media-src 'self' data: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  // In development, we need to be more permissive for hot reloading
  if (isDevelopment) {
    cspDirectives[1] = "script-src 'self' 'unsafe-eval' 'unsafe-inline' http://localhost:* ws://localhost:*";
    cspDirectives[4] = "connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:*";
  }

  const csp = cspDirectives.join("; ");

  return (
    <>
      <meta httpEquiv="Content-Security-Policy" content={csp} />
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />
      {nonce && <meta name="csp-nonce" content={nonce} />}
    </>
  );
}

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
