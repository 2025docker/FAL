import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
  const { user, signIn, isConfigured } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path d="M8 22V10a2 2 0 012-2h2v10a2 2 0 01-2 2H8z" fill="#10b981" />
            <path d="M14 22V8a2 2 0 012-2h2v12a2 2 0 01-2 2h-2z" fill="#f59e0b" />
            <path d="M20 22V12a2 2 0 012-2h2v8a2 2 0 01-2 2h-2z" fill="#10b981" />
            <path d="M8 24h14v2H8z" fill="#10b981" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">FAL</h1>
        <p className="text-sm text-gray-500 mb-6">Finance & Asset Ledger</p>

        <p className="text-xs text-gray-400 mb-6">
          Sign in with Google to access your financial data
        </p>

        <button
          className="btn btn-primary w-full"
          onClick={signIn}
          disabled={!isConfigured}
        >
          {isConfigured ? 'Sign in with Google' : 'Configuration Required'}
        </button>

        {!isConfigured && (
          <p className="text-xs text-red-500 mt-4">
            Please configure Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
          </p>
        )}
      </div>
    </div>
  );
}
