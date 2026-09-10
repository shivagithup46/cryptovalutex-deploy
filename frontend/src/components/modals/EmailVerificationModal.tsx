import React, { useState, useEffect } from 'react';
import { X, Mail, ShieldCheck, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchApi } from '../../utils/api';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialEmail?: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialEmail = ''
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [inputEmail, setInputEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setInputEmail(initialEmail);
      setOtp(['', '', '', '', '', '']);
      setError(null);
    }
  }, [isOpen, initialEmail]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      if (countdown <= 270) { // Can resend after 30 seconds
        setCanResend(true);
      }
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleSendOtp = async () => {
    if (!inputEmail || !/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/.test(inputEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email: inputEmail })
      });
      
      if (res.developmentOtp) {
          alert('Development Mode - Your OTP is: ' + res.developmentOtp);
      }
      
      setStep(2);
      setCountdown(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP to your email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await fetchApi('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: inputEmail, otp: otpString })
      });
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`email-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`email-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    // Focus last input
    const lastInput = document.getElementById(`email-otp-5`);
    lastInput?.focus();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-vault-900 border border-vault-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-vault-700/50">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="text-primary" size={24} />
            Email Verification
          </h2>
          <button 
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-accent-pink/10 border border-accent-pink/20 rounded-xl flex items-start gap-3 text-accent-pink">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-6">
              <p className="text-secondary text-sm">
                We will send a secure One-Time Password (OTP) to your registered email address.
              </p>
              
              <div className="space-y-2">
                <label className="text-sm text-secondary block font-medium">Email Address</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-vault-800 border border-vault-700 rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none focus:border-accent-neonBlue/50 font-medium transition-colors"
                  />
                </div>
              </div>

              <button 
                onClick={handleSendOtp}
                disabled={loading || !inputEmail}
                className="w-full py-4 bg-accent-neonBlue hover:bg-accent-neonBlue/90 text-primary rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw size={20} className="animate-spin" /> : null}
                Send OTP to Email
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-secondary text-sm">
                  We've sent a 6-digit code to
                </p>
                <p className="text-primary font-medium tracking-wide">
                  {inputEmail}
                </p>
                <button 
                  onClick={() => setStep(1)} 
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Change Email
                </button>
              </div>
              
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`email-otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 bg-vault-800 border border-vault-700 rounded-xl text-center text-primary text-xl font-bold focus:outline-none focus:border-accent-neonBlue focus:ring-1 focus:ring-accent-neonBlue transition-all"
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-2xl font-mono font-light text-primary tracking-widest">
                  {formatTime(countdown)}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join('').length !== 6 || countdown === 0}
                  className="w-full py-4 bg-accent-neonBlue hover:bg-accent-neonBlue/90 text-primary rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                  Verify Email
                </button>
                
                <button 
                  onClick={handleSendOtp}
                  disabled={!canResend || loading}
                  className="w-full py-3 bg-transparent border border-vault-700 hover:bg-vault-800 text-secondary rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {canResend ? 'Resend OTP' : `Resend available in ${formatTime(countdown - 270 > 0 ? countdown - 270 : 0)}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
