import { useState } from 'react';
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
  const [loginRecaptchaToken, setLoginRecaptchaToken] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');

  // ----------------------------------------------------
  // REGISTRATION & OTP STATE
  // ----------------------------------------------------
  const [registerStep, setRegisterStep] = useState<'form' | 'otp' | 'success'>('form');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerTerms, setRegisterTerms] = useState(false);
  const [registerRecaptchaToken, setRegisterRecaptchaToken] = useState('');
  const [registerOtp, setRegisterOtp] = useState('');
  const [registerOtpError, setRegisterOtpError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerErrorMsg, setRegisterErrorMsg] = useState('');

  // ----------------------------------------------------
  // LOGIN SUBMIT (Real API verification with reCAPTCHA v2)
  // ----------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    setLoginErrorMsg('');

    if (!loginRecaptchaToken) {
      setLoginErrorMsg('Silakan centang verifikasi "I\'m not a robot" terlebih dahulu.');
      return;
    }

    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim().toLowerCase(),
          password: loginPassword,
          recaptchaToken: loginRecaptchaToken,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLoginErrorMsg(data.error || 'Email atau password salah.');
        setLoginLoading(false);
        return;
      }

      // Store authenticated session cache
      setStoredAuthSession({
        id: data.user.id,
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        const redirectParam = typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('redirect')
          : null;
        router.push(redirectParam || '/dashboard');
      }
    } catch (err: unknown) {
      console.error('[Login Submission Error]:', err);
      setLoginErrorMsg('Gagal terhubung ke server autentikasi.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ----------------------------------------------------
  // REGISTER SUBMIT (Form Step -> Send 6-digit OTP)
  // ----------------------------------------------------
  const handleRegisterSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterErrorMsg('');

    if (!registerRecaptchaToken) {
      setRegisterErrorMsg('Silakan centang verifikasi "I\'m not a robot" terlebih dahulu.');
      return;
    }

    if (!registerFullName.trim()) {
      setRegisterErrorMsg('Nama lengkap wajib diisi.');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterErrorMsg('Password dan konfirmasi password tidak cocok.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(registerPassword)) {
      setRegisterErrorMsg('Password minimal 8 karakter dan harus kombinasi huruf serta angka.');
      return;
    }

    if (!registerTerms) {
      setRegisterErrorMsg('Anda harus menyetujui syarat & ketentuan TEMBOX.');
      return;
    }

    setRegisterLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: registerFullName.trim(),
          email: registerEmail.trim().toLowerCase(),
          password: registerPassword,
          confirmPassword: registerConfirmPassword,
          recaptchaToken: registerRecaptchaToken,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setRegisterErrorMsg(data.error || 'Pendaftaran akun gagal.');
        setRegisterLoading(false);
        return;
      }

      setRegisterStep('otp');
    } catch (err: unknown) {
      console.error('[Register Submission Error]:', err);
      setRegisterErrorMsg('Terjadi kesalahan jaringan saat mengirim kode OTP.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // ----------------------------------------------------
  // RESEND OTP
  // ----------------------------------------------------
  const handleResendOtp = async () => {
    setRegisterOtp('');
    setRegisterOtpError('');
    setRegisterLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerEmail.trim().toLowerCase(),
          recipientName: registerFullName.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRegisterOtpError(data.error || 'Gagal mengirim ulang kode OTP.');
      }
    } catch {
      setRegisterOtpError('Gagal mengirim ulang kode OTP.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // ----------------------------------------------------
  // VERIFY OTP (OTP Step -> Activate Account & Session)
  // ----------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    setRegisterOtpError('');

    if (registerOtp.trim().length < 6) {
      setRegisterOtpError('Masukkan 6 digit kode OTP yang lengkap.');
      return;
    }

    setRegisterLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerEmail.trim().toLowerCase(),
          recipientName: registerFullName.trim(),
          otpCode: registerOtp.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setRegisterOtpError(data.error || 'Kode verifikasi OTP tidak valid.');
        setRegisterLoading(false);
        return;
      }

      setRegisterStep('success');

      // Store authenticated session cache
      setStoredAuthSession({
        id: data.user.id,
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      console.error('[Verify OTP Error]:', err);
      setRegisterOtpError('Terjadi kesalahan saat memverifikasi kode OTP.');
    } finally {
      setRegisterLoading(false);
    }
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
    loginRecaptchaToken,
    setLoginRecaptchaToken,
    loginLoading,
    loginErrorMsg,
    setLoginErrorMsg,
    handleLoginSubmit,

    // Registration & OTP
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
    registerRecaptchaToken,
    setRegisterRecaptchaToken,
    registerOtp,
    setRegisterOtp,
    registerOtpError,
    setRegisterOtpError,
    registerLoading,
    registerErrorMsg,
    setRegisterErrorMsg,
    handleRegisterSubmitForm,
    handleVerifyOtp,
    handleResendOtp,
  };
}
