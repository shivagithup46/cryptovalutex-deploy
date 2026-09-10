import React, { useState, useEffect } from 'react';
import { X, Phone, ShieldCheck, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchApi } from '../../utils/api';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialPhone?: string;
}

const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialPhone = ''
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState(initialPhone);
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhone(initialPhone.replace('+91', '').trim());
      setOtp(['', '', '', '', '', '']);
      setError(null);
      setDevOtp(null);
    }
  }, [isOpen, initialPhone]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      if (countdown <= 240) { // Can resend after 60 seconds
        setCanResend(true);
      }
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fullPhone = `${countryCode}${phone}`;
      const response = await fetchApi('/api/verification/send-phone-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: fullPhone })
      });
      
      if (response.developmentOtp) {
        setDevOtp(response.developmentOtp);
      }
      
      setStep(2);
      setCountdown(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
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
      const fullPhone = `${countryCode}${phone}`;
      await fetchApi('/api/verification/verify-phone-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: fullPhone, otp: otpString })
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
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
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
            Phone Verification
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
                Enter your mobile number to receive a secure One-Time Password (OTP) for verification.
              </p>
              
              <div className="space-y-2">
                <label className="text-sm text-secondary block font-medium">Phone Number</label>
                <div className="flex gap-2">
                  <select 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-vault-800 border border-vault-700 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent-neonBlue/50 w-28"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full bg-vault-800 border border-vault-700 rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none focus:border-accent-neonBlue/50 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSendOtp}
                disabled={loading || !phone}
                className="w-full py-4 bg-accent-neonBlue hover:bg-accent-neonBlue/90 text-primary rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw size={20} className="animate-spin" /> : null}
                Send OTP
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-secondary text-sm">
                  We've sent a 6-digit code to
                </p>
                <p className="text-primary font-mono font-bold text-lg tracking-wide">
                  {countryCode} {phone}
                </p>
                <button 
                  onClick={() => setStep(1)} 
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Change Number
                </button>
              </div>
              
              {devOtp && (
                <div className="p-3 bg-accent-green/10 border border-accent-green/20 rounded-xl text-center">
                  <p className="text-accent-green text-xs font-bold mb-1">DEVELOPMENT MODE - OTP IS:</p>
                  <p className="text-primary font-mono text-xl tracking-widest">{devOtp}</p>
                </div>
              )}
              
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
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
                  Verify Number
                </button>
                
                <button 
                  onClick={handleSendOtp}
                  disabled={!canResend || loading}
                  className="w-full py-3 bg-transparent border border-vault-700 hover:bg-vault-800 text-secondary rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {canResend ? 'Resend OTP' : `Resend available in ${formatTime(countdown - 240 > 0 ? countdown - 240 : 0)}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationModal;
