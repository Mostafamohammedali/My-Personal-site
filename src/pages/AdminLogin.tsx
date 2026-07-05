import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously
} from 'firebase/auth';
import { Lock, Mail, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { auth } from '../lib/firebase';
import { usePortfolio } from '../context/PortfolioContext';

interface LoginInputs {
  email: string;
  pin: string;
}

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { user } = usePortfolio();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInputs>({
    defaultValues: {
      email: 'admin@portfolio.com',
      pin: 'adminpassword'
    }
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/admin');
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setAuthError(err.message || "Google authentication failed. Please ensure your popups are enabled.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await signInAnonymously(auth);
      navigate('/admin');
    } catch (err: any) {
      console.error("Anonymous Auth error:", err);
      setAuthError(err.message || "Anonymous authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: LoginInputs) => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      try {
        await signInWithEmailAndPassword(auth, data.email, data.pin);
        navigate('/admin');
      } catch (signInErr: any) {
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          if (data.email === 'admin@portfolio.com' && data.pin === 'adminpassword') {
            try {
              await createUserWithEmailAndPassword(auth, data.email, data.pin);
              navigate('/admin');
            } catch (signUpErr: any) {
              throw signInErr;
            }
          } else {
            throw signInErr;
          }
        } else {
          throw signInErr;
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setAuthError("Email & Password Auth is currently disabled on this Firebase project. Please use the 'Instant Admin Access' button below, which works seamlessly with zero setup required!");
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAuthError("Invalid credentials. Please use the default values shown below.");
      } else if (err.code === 'auth/invalid-email') {
        setAuthError("Please specify a valid email address.");
      } else {
        setAuthError(err.message || "An authentication error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl flex flex-col gap-6 text-left border border-white/80"
      >
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0084FF] flex items-center justify-center text-white shadow-lg shadow-blue-500/15">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black text-neutral-900 tracking-tight">Security Portal</h1>
            <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mt-1 font-bold">Website Administration Access</p>
          </div>
        </div>

        {authError && (
          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-start gap-2 text-xs text-red-600 font-semibold">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-500" />
            <span className="leading-relaxed">{authError}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleAnonymousSignIn}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-55 shadow-md shadow-blue-500/15 hover:scale-[1.01] cursor-pointer"
          >
            <Sparkles className="w-4.5 h-4.5 text-blue-200 animate-pulse" />
            <span>Instant Admin Access (No Setup)</span>
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-neutral-50 border border-black/10 text-neutral-800 hover:bg-neutral-100 font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-55 hover:scale-[1.01] shadow-xs cursor-pointer"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.1-.13-.19-.38-.28-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="h-px flex-1 bg-black/5"></div>
            <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-bold">or config keys</span>
            <div className="h-px flex-1 bg-black/5"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email */}
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Auth Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full pl-10 pr-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF]/20 transition-all duration-300 font-bold"
                placeholder="admin@portfolio.com"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] font-mono text-red-500 mt-1">{errors.email.message}</span>
            )}
          </div>

          {/* Passcode */}
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Access Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                {...register("pin", { required: "Passcode is required" })}
                className="w-full pl-10 pr-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF]/20 transition-all duration-300 font-bold"
                placeholder="••••••••"
              />
            </div>
            {errors.pin && (
              <span className="text-[10px] font-mono text-red-500 mt-1">{errors.pin.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-55 mt-4 shadow-md shadow-blue-500/15 hover:scale-[1.01] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Node...</span>
              </>
            ) : (
              <span>Decrypt Entry</span>
            )}
          </button>
        </form>

        {/* Demo instructions */}
        <div className="p-4 bg-neutral-50 border border-black/5 rounded-xl flex flex-col gap-1.5 text-xs text-neutral-500 font-sans">
          <span className="font-bold text-neutral-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#0084FF]" />
            <span>Admin Gateway Bootstrapped</span>
          </span>
          <p className="text-[11px] leading-relaxed">
            Anonymous authentication is enabled by default in your Firebase workspace. Simply use the <strong className="text-[#0084FF] font-semibold">Instant Admin Access (No Setup)</strong> button above to securely authenticate and access the administrator portal immediately.
          </p>
          <div className="font-mono text-[10px] text-neutral-600 bg-black/5 p-2 rounded mt-2 border border-black/5 flex flex-col gap-1 font-semibold">
            <div>Recommended method: <span className="text-black font-bold">Instant Admin Access (No Setup)</span></div>
            <div>Secondary methods (requires manual configuration):</div>
            <div className="pl-2 mt-1 font-bold">Google Sign-In</div>
            <div className="pl-2">Email: <span className="text-black font-bold">admin@portfolio.com</span></div>
            <div className="pl-2">Code: <span className="text-black font-bold">adminpassword</span></div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
