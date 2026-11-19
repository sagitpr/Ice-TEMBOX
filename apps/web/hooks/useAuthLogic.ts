import { useState, useEffect } from 'react';
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

  // ----------------------------------------------------
  // 2-STEP REGISTRATION WITH GOOGLE VERIFIED BINDING
  // ----------------------------------------------------
  const [googleToken, setGoogleToken] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerTerms, setRegisterTerms] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerErrorMsg, setRegisterErrorMsg] = useState('');

  // Detect Google verified registration token from URL search params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const emailParam = params.get('email');
    const nameParam = params.get('name');
    const errorParam = params.get('error');

    if (tokenParam && emailParam) {
      setGoogleToken(tokenParam);
      setGoogleEmail(emailParam);
      if (nameParam) {
        setRegisterFullName(nameParam);
      }
    }

    if (errorParam) {
      setRegisterErrorMsg(errorParam);
    }
  }, []);

  // ----------------------------------------------------
  // LOGIN SUBMIT (Real API verification - No mock / No fallback)
  // ----------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    setLoginErrorMsg('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim().toLowerCase(),
          password: loginPassword,
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
  // STEP 1: TRIGGER GOOGLE VERIFICATION
  // ----------------------------------------------------
  const handleInitiateGoogleVerification = () => {
    setRegisterErrorMsg('');
    window.location.href = '/api/auth/verify-google';
  };

  // ----------------------------------------------------
  // STEP 2: FINALIZE REGISTRATION WITH APP PASSWORD
  // ----------------------------------------------------
  const handleRegisterSubmit = async (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    setRegisterErrorMsg('');

    if (!googleToken) {
      setRegisterErrorMsg('Akun Google belum diverifikasi. Silakan klik tombol verifikasi terlebih dahulu.');
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
          token: googleToken,
          fullName: registerFullName.trim(),
          password: registerPassword,
          confirmPassword: registerConfirmPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.tokenExpired) {
          setGoogleToken('');
          setGoogleEmail('');
        }
        setRegisterErrorMsg(data.error || 'Pendaftaran gagal.');
        setRegisterLoading(false);
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
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      console.error('[Register Submission Error]:', err);
      setRegisterErrorMsg('Terjadi kesalahan jaringan saat mendaftarkan akun.');
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
    loginLoading,
    loginErrorMsg,
    setLoginErrorMsg,
    handleLoginSubmit,

    // 2-Step Registration
    googleToken,
    googleEmail,
    registerFullName,
    setRegisterFullName,
    registerPassword,
    setRegisterPassword,
    registerConfirmPassword,
    setRegisterConfirmPassword,
    showRegisterPassword,
    setShowRegisterPassword,
    registerTerms,
    setRegisterTerms,
    registerLoading,
    registerErrorMsg,
    setRegisterErrorMsg,
    handleInitiateGoogleVerification,
    handleRegisterSubmit,
  };
}
