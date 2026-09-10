import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { fetchApi } from '../utils/api';
import { Eye, EyeOff } from 'lucide-react';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service');
      return;
    }

    setLoading(true);
    try {
      await fetchApi('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      setSuccess('Registration successful! Please check your email.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vault-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-electricCyan rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-purple rounded-full mix-blend-screen filter blur-[128px] animate-pulse delay-700"></div>
      </div>

      <div className="glass-card w-full max-w-lg p-8 z-10 relative mt-10 mb-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex justify-center drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <Logo className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-2">Create an Account</h2>
          <p className="text-secondary">Join CryptoVaultX and start trading today</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-lg mb-6 text-sm text-center">
            {success}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">First Name</label>
              <input 
                type="text" 
                className="glass-input w-full" 
                placeholder="John" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Last Name</label>
              <input 
                type="text" 
                className="glass-input w-full" 
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
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
            <label className="block text-sm font-medium text-secondary mb-2">Password</label>
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
            <p className="text-xs text-muted mt-2">Must be at least 8 characters with numbers and symbols.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                className="glass-input w-full pr-10" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              className="mt-1 bg-vault-700 border-vault-600 rounded text-primary focus:ring-accent-neonBlue" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span className="text-sm text-secondary">
              I agree to the <a href="#" className="text-accent-electricCyan hover:text-primary">Terms of Service</a> and <a href="#" className="text-accent-electricCyan hover:text-primary">Privacy Policy</a>.
            </span>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full py-3 text-lg mt-4 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-electricCyan hover:text-primary font-medium transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
