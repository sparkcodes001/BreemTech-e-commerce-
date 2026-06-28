import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import useAdminAuthStore from "../../store/adminAuthStore";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, error, clearError, isAuthenticated, lockUntil } =
    useAdminAuthStore();
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const logoRef = useRef(null);

  const isLocked = lockUntil && Date.now() < lockUntil;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    );
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      },
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    clearError();
    setIsLoading(true);

    gsap.to(cardRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    await new Promise((r) => setTimeout(r, 800));

    const success = login(email, password);

    if (success) {
      gsap.to(cardRef.current, {
        scale: 1.02,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => navigate("/admin/dashboard"),
      });
    } else {
      gsap.fromTo(
        cardRef.current,
        { x: -10 },
        { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" },
      );
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-dark flex items-center
      justify-center px-4 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2
        w-[600px] h-[600px] rounded-full
        bg-accent/5 blur-[120px] pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-0
        w-[400px] h-[400px] rounded-full
        bg-accent/3 blur-[100px] pointer-events-none"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div ref={logoRef} className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center
            w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 mb-4"
          >
            <Zap size={32} className="text-accent" />
          </div>
          <h1 className="font-display font-bold text-3xl text-light">
            Nexus{" "}
            <span
              className="text-transparent bg-clip-text
              bg-gradient-to-r from-accent to-light"
            >
              Admin
            </span>
          </h1>
          <p className="text-primary-500 text-sm mt-1">
            Authorized personnel only
          </p>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          className="bg-dark-200 border border-dark-400
          rounded-3xl p-6 sm:p-8 space-y-6"
        >
          <div>
            <h2 className="text-light font-bold text-xl">Welcome back</h2>
            <p className="text-primary-500 text-sm mt-1">
              Enter your admin credentials to continue
            </p>
          </div>

          {/* Locked Out State */}
          {isLocked ? (
            <div className="space-y-4">
              <div
                className="flex flex-col items-center gap-3
                bg-red-500/10 border border-red-500/30
                rounded-2xl px-4 py-6 text-center"
              >
                <ShieldAlert size={32} className="text-red-400" />
                <div>
                  <p className="text-red-400 font-bold text-sm">
                    Account Temporarily Locked
                  </p>
                  <p className="text-red-400/70 text-xs mt-1">
                    Too many failed attempts. Please wait 15 minutes before
                    trying again.
                  </p>
                </div>
              </div>
              <a
                href="/"
                className="w-full border border-dark-400 text-primary-400
                  font-semibold text-sm py-3.5 rounded-xl
                  hover:border-accent hover:text-accent
                  transition-all duration-300 flex items-center
                  justify-center gap-2"
              >
                ← Back to Store
              </a>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-3 bg-red-500/10
                  border border-red-500/30 rounded-2xl px-4 py-3"
                >
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2
                      text-primary-500"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter admin email"
                      required
                      autoComplete="off"
                      className="w-full bg-dark-300 border border-dark-400
                        rounded-xl pl-11 pr-4 py-3 text-light text-sm
                        placeholder:text-primary-600
                        focus:outline-none focus:border-accent/50
                        focus:bg-dark-200 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2
                      text-primary-500"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="off"
                      className="w-full bg-dark-300 border border-dark-400
                        rounded-xl pl-11 pr-12 py-3 text-light text-sm
                        placeholder:text-primary-600
                        focus:outline-none focus:border-accent/50
                        focus:bg-dark-200 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2
                        text-primary-500 hover:text-accent transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-dark font-bold text-sm
                    uppercase tracking-widest py-3.5 rounded-xl
                    hover:bg-light transition-all duration-300
                    hover:shadow-xl hover:shadow-accent/30
                    flex items-center justify-center gap-2
                    hover:scale-[1.02] active:scale-95
                    disabled:opacity-70 disabled:cursor-not-allowed
                    disabled:hover:scale-100 mt-2"
                >
                  {isLoading ? (
                    <div
                      className="w-5 h-5 border-2 border-dark/30
                      border-t-dark rounded-full animate-spin"
                    />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* ✅ Security notice instead of credentials */}
              <div
                className="flex items-center gap-2 bg-dark-300
                border border-dark-400 rounded-2xl p-4"
              >
                <ShieldAlert size={14} className="text-primary-500 shrink-0" />
                <p className="text-primary-600 text-xs">
                  This area is restricted to authorized administrators only.
                  Unauthorized access attempts are logged.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Back to store */}
        {!isLocked && (
          <p className="text-center text-primary-600 text-xs mt-6">
            <a href="/" className="hover:text-accent transition-colors">
              ← Back to Store
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
