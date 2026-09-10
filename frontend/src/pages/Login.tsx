import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetchApi('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      login(response.token, {
        email: response.email,
        roles: response.role ? [response.role] : []
      });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vault-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-neonBlue rounded-full mix-blend-screen filter blur-[128px] animate-pulse delay-1000"></div>
      </div>

      <div className="glass-card w-full max-w-md p-8 z-10 relative">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex justify-center drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <Logo className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back</h2>
          <p className="text-secondary">Sign in to continue to CryptoVaultX</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Email Address</label>
            <input 
              type="email" 
              className="glass-input w-full" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-secondary">Password</label>
              <a href="#" className="text-sm text-accent-electricCyan hover:text-primary transition-colors">Forgot password?</a>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="glass-input w-full pr-10" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="btn-primary w-full py-3 text-lg mt-4 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-electricCyan hover:text-primary font-medium transition-colors">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
