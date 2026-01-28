'use client'

export default function DebugEnv() {
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Environment Check</h1>
            <pre className="bg-gray-100 p-4 rounded">
                NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Loaded' : '❌ Missing'}<br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing'}
            </pre>
            <p className="mt-4 text-sm text-gray-500">
                If these are missing, ensure your <code>.env.local</code> file in the root directory has these exact variable names.
            </p>
        </div>
    )
}
