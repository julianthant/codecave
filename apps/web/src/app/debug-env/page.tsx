// Debug page to check environment variables
// Remove this file after debugging

export default function DebugEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <div className="space-y-2">
        <p>
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
          {supabaseUrl ? 'Set ✅' : 'Missing ❌'}
          {supabaseUrl && <span className="ml-2 text-sm text-gray-500">({supabaseUrl.substring(0, 20)}...)</span>}
        </p>
        <p>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
          {supabaseAnonKey ? 'Set ✅' : 'Missing ❌'}
          {supabaseAnonKey && <span className="ml-2 text-sm text-gray-500">({supabaseAnonKey.substring(0, 20)}...)</span>}
        </p>
      </div>
      <div className="mt-4 p-4 bg-yellow-100 rounded">
        <p className="text-sm">
          <strong>Note:</strong> Delete this debug page after verifying environment variables are working.
        </p>
      </div>
    </div>
  );
}
