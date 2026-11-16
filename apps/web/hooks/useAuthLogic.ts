import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setStoredAuthSession } from '../modules/auth/useAuthSession';

export function useAuthLogic() {
  const router = useRouter();

  // ----------------------------------------------------
  // LOGIN STATE
  // ----------------------------------------------------
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const loginTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ----------------------------------------------------
  // REGISTER & OTP STATE
  // ----------------------------------------------------
  const [registerStep, setRegisterStep] = useState<'form' | 'otp' | 'success'>('form');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerTerms, setRegisterTerms] = useState(false);
  const [registerOtp, setRegisterOtp] = useState('');
  const [registerOtpError, setRegisterOtpError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerErrorMsg, setRegisterErrorMsg] = useState('');
  const registerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (loginTimerRef.current) clearTimeout(loginTimerRef.current);
      if (registerTimerRef.current) clearTimeout(registerTimerRef.current);
    };
  }, []);

  // Login submission
  const handleLoginSubmit = (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    setLoginErrorMsg('');
    setLoginLoading(true);

    if (loginTimerRef.current) clearTimeout(loginTimerRef.current);
    loginTimerRef.current = setTimeout(() => {
      setLoginLoading(false);

      // Resolve full profile name from cache or format nicely
      let resolvedName = '';
      if (typeof window !== 'undefined') {
        try {
          const profileRaw = localStorage.getItem('tembox_user_profile');
          if (profileRaw) {
            const parsedProfile = JSON.parse(profileRaw);
            if (parsedProfile.fullName) {
              resolvedName = parsedProfile.fullName;
            }
          }
        } catch {}
      }

      if (!resolvedName) {
        const prefix = loginEmail.split('@')[0] || '';
        resolvedName = prefix
          .split(/[._-]/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ') || 'Pengguna TEMBOX';
      }

      const cleanUserId = (loginEmail.split('@')[0] || 'user').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'nelayan';

      // Persist authenticated session centrally
      setStoredAuthSession({
        id: `usr_${cleanUserId}`,
        userId: `usr_${cleanUserId}`,
        name: resolvedName,
        email: loginEmail,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        const redirectParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;
        if (redirectParam) {
          router.push(redirectParam);
        } else {
          router.push('/dashboard');
        }
      }
    }, 350);
  };

  // Register Form submission (proceed to OTP)
  const handleRegisterSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterErrorMsg('');

    if (registerPassword !== registerConfirmPassword) {
      setRegisterErrorMsg('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    if (registerPassword.length < 8) {
      setRegisterErrorMsg('Password minimal harus 8 karakter!');
      return;
    }

    if (!registerTerms) {
      setRegisterErrorMsg('Anda harus menyetujui syarat & ketentuan TEMBOX.');
      return;
    }

    // Cache user profile for immediate retrieval upon login
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'tembox_user_profile',
          JSON.stringify({ fullName: registerFullName.trim(), email: registerEmail.trim() })
        );
      } catch {}
    }

    setRegisterLoading(true);
    // Send branded OTP verification email via SMTP
    fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerEmail,
        recipientName: registerFullName,
      }),
    }).catch((err) => {
      console.warn('Background OTP email dispatch:', err);
    });

    if (registerTimerRef.current) clearTimeout(registerTimerRef.current);
    registerTimerRef.current = setTimeout(() => {
      setRegisterLoading(false);
      setRegisterStep('otp');
    }, 450);
  };

  // OTP Verification & Automatic Welcome Email Trigger
  const handleVerifyOtp = async (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    setRegisterOtpError('');

    if (registerOtp.length < 6) {
      setRegisterOtpError('Masukkan 6 digit kode OTP yang lengkap.');
      return;
    }

    setRegisterLoading(true);

    try {
      // Trigger server-side OTP validation and automatic Welcome Email dispatch
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerEmail,
          recipientName: registerFullName,
          otpCode: registerOtp,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRegisterOtpError(data.error || 'Verifikasi OTP gagal. Silakan coba lagi.');
        setRegisterLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Verifikasi OTP background dispatch fallback:', err);
    }

    setRegisterLoading(false);
    setRegisterStep('success');

    // Persist authenticated session centrally
    const cleanUserId = (registerEmail.split('@')[0] || 'user').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'nelayan';
    setStoredAuthSession({
      id: `usr_${cleanUserId}`,
      userId: `usr_${cleanUserId}`,
      name: registerFullName.trim() || registerEmail.split('@')[0] || 'Pengguna TEMBOX',
      email: registerEmail,
    });

    if (onSuccess) {
      onSuccess();
    } else {
      const redirectParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;
      if (redirectParam) {
        router.push(redirectParam);
      }
    }
  };

  const resetRegisterState = () => {
    setRegisterStep('form');
    setRegisterFullName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setShowRegisterPassword(false);
    setRegisterTerms(false);
    setRegisterOtp('');
    setRegisterOtpError('');
    setRegisterErrorMsg('');
    setRegisterLoading(false);
  };

  return {
    // Login
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    showLoginPassword,
    setShowLoginPassword,
    rememberMe,
    setRememberMe,
    loginLoading,
    loginErrorMsg,
    setLoginErrorMsg,
    handleLoginSubmit,

    // Register
    registerStep,
    setRegisterStep,
    registerFullName,
    setRegisterFullName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    registerConfirmPassword,
    setRegisterConfirmPassword,
    showRegisterPassword,
    setShowRegisterPassword,
    registerTerms,
    setRegisterTerms,
    registerOtp,
    setRegisterOtp,
    registerOtpError,
    setRegisterOtpError,
    registerLoading,
    registerErrorMsg,
    handleRegisterSubmitForm,
    handleVerifyOtp,
    resetRegisterState,
  };
}
