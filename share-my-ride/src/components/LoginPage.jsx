import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const { login, register } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  // Login state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginServerError, setLoginServerError] = useState('');

  // Signup state
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupServerError, setSignupServerError] = useState('');

  // --- Login Handlers ---
  const validateLogin = () => {
    const e = {};
    if (!loginForm.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) e.email = 'Invalid email format';
    if (!loginForm.password) e.password = 'Password is required';
    else if (loginForm.password.length < 8) e.password = 'Min 8 characters';
    setLoginErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoginLoading(true); setLoginServerError('');
    try {
      await login(loginForm.email, loginForm.password);
      navigate('/dashboard');
    } catch (err) {
      setLoginServerError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // --- Signup Handlers ---
  const validateSignup = () => {
    const e = {};
    if (!signupForm.name.trim()) e.name = 'Name is required';
    if (!signupForm.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) e.email = 'Invalid email format';
    if (!signupForm.phone.trim()) e.phone = 'Phone is required';
    if (!signupForm.password) e.password = 'Password is required';
    else if (signupForm.password.length < 8) e.password = 'Min 8 characters';
    if (signupForm.password !== signupForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setSignupErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setSignupLoading(true); setSignupServerError('');
    try {
      await register(signupForm.name, signupForm.email, signupForm.phone, signupForm.password);
      navigate('/dashboard');
    } catch (err) {
      setSignupServerError(err.message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      {/* ─────────── Image Side (Left) ─────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
        <img alt="Modern university campus" className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxxQ9yl-nlMYR94Ixp1eQLowLLgPiV63oepIGrK1TfN0Iyq7ocPenzIuxI_HMDLNs9dsPAI5YZgr5F_Z8g4YaSEFdwG_4sryhYtUALr_LY534gi8l0qXa-p1_A-TMNWe4VTGz_tnzoObkYYHOkI-LjvrwU_89HgtEXE6qiZUBuJ6dmXLse59qu_qIQwSBCzgwVL11YNkZyN49Or4__-G30cLKB09QIEw1q-k3zui4CamL4Olg63j7FGfSqwZPMIgVXqvdXClTgOAZS" />
        <div className="relative z-20 flex flex-col justify-between p-12 text-white bg-gradient-to-t from-primary/80 to-transparent w-full h-full">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-4xl">directions_car</span>
            <h1 className="text-2xl font-bold tracking-tight">ShareMyRide</h1>
          </Link>
          <div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">The safest way for students to commute together.</h2>
            <p className="text-lg text-slate-100 max-w-md opacity-90">Join thousands of verified university students saving money and reducing their carbon footprint every day.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex -space-x-3">
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-primary bg-slate-200" alt="Student avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCimB-nX-UdqD_JctLhDgatqHb0z3E27CHT4KEnRZtq7HUK9DtuH3M5dEhzR11ucvqw0ukmpj9DyN3Wd2_u0fRPIEw-33LAdoh_KuZaEYTVCsqxA_nISh9_lmfgHA-T3aNuXl4Jsv0E-ndpBuEcV7bo3XETFbsH238FT5J7iSA7hznt3sjeicC2MxD0DVX6Gt1QY1Xkfm1OMaCfvnBirv2zv6zNrNQYT7tT7EhJEbA0Ax42qkUr3sccMRSQZsvW9X5g0lw_T_IdGM6" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-primary bg-slate-200" alt="Student avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHRlYS6s6GKKDr1I1f6Xr95Y__vP23DrWpiyaX27HSMLAfv-Y-z0_rr5HVkoJq1WfMUYEqbFXKv2I3iSiUIbT0bKBRcwH7ExV6i8qD4WW6ZPbEQWj10bJUY0wuNnwGE4nD5wy5qQoB8vIBGUlwEpZ1oWsbqjia081xAQa4Nm6Ph-wIW7f4EQnKufgQ0ElbaPaK4ENtCdYthTdEtDIqREiSL6zRucYRyPQFbSm-BE-3iw-0Ct6AIkOIsrmPSh0YFlqXz-HDLYguB_v6" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-primary bg-slate-200" alt="Student avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF4PA7qxilK-USE-qm3JUO_-Ym_N4ApmHXzUQWtjmGtFtvd66Wt71QPl7G5GnouCYCOQiDHesDNygESaTlIwfMRA7111NGcTEpG0doaLZ9QDYWBUsiwYFV3JWXePNZT00k8rcWrT2gQWQVZyvSEPkDb8n2amHT-O8z-uQfdcY60flGYnCzfSoauUPWrhKAWGZXiRyoS4krb3Lt31YsxqFcz2CfvqnZEe5RPm5komJtGsgZy8_Cs7PaFqr0Sh_rFZ5xPc0p7P7LIZq5" />
            </div>
            <div className="text-sm font-medium self-center">Joined by 500+ students this week</div>
          </div>
        </div>
      </div>

      {/* ─────────── Form Side (Right) ─────────── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 bg-background-light dark:bg-background-dark overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">directions_car</span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ShareMyRide</h1>
            </Link>
            <button onClick={toggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
              <span className="material-symbols-outlined">{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {activeTab === 'login' ? 'Get started' : 'Create account'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {activeTab === 'login' ? 'Welcome back! Please enter your details.' : 'Join the campus carpooling community today.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-primary/10 dark:border-primary/20">
            <button className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'login' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
              onClick={() => setActiveTab('login')}>Login</button>
            <button className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'signup' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
              onClick={() => setActiveTab('signup')}>Sign Up</button>
          </div>

          {/* ─── LOGIN FORM ─── */}
          {activeTab === 'login' && (
            <form className="space-y-6" onSubmit={handleLogin}>
              {loginServerError && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">{loginServerError}</div>}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="login-email">University Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary text-sm">school</span>
                  </div>
                  <input ref={emailRef} value={loginForm.email} onChange={e => { setLoginForm(p => ({...p, email: e.target.value})); setLoginErrors(p => ({...p, email: ''})); }}
                    className={`block w-full pl-10 pr-3 py-3 border ${loginErrors.email ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                    id="login-email" placeholder="yourname@university.edu" type="email" />
                </div>
                {loginErrors.email ? <p className="text-red-500 text-xs">{loginErrors.email}</p> : <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Must be a verified .edu address</p>}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="login-password">Password</label>
                  <a className="text-xs font-bold text-primary hover:underline" href="#">Forgot password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary text-sm">lock</span>
                  </div>
                  <input value={loginForm.password} onChange={e => { setLoginForm(p => ({...p, password: e.target.value})); setLoginErrors(p => ({...p, password: ''})); }}
                    className={`block w-full pl-10 pr-10 py-3 border ${loginErrors.password ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                    id="login-password" placeholder="••••••••" type="password" />
                </div>
                {loginErrors.password && <p className="text-red-500 text-xs">{loginErrors.password}</p>}
              </div>
              <div className="flex items-center">
                <input className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800" id="remember-me" type="checkbox" />
                <label className="ml-2 text-sm text-slate-600 dark:text-slate-400 font-medium cursor-pointer" htmlFor="remember-me">Remember me for 30 days</label>
              </div>
              <button type="submit" disabled={loginLoading}
                className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform active:scale-[0.98] disabled:opacity-50 cursor-pointer">
                {loginLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          )}

          {/* ─── SIGNUP FORM ─── */}
          {activeTab === 'signup' && (
            <form className="space-y-5" onSubmit={handleSignup}>
              {signupServerError && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">{signupServerError}</div>}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="signup-name">Full Name</label>
                <div className="relative group"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary text-sm">person</span></div>
                <input value={signupForm.name} onChange={e => { setSignupForm(p => ({...p, name: e.target.value})); setSignupErrors(p => ({...p, name: ''})); }}
                  className={`block w-full pl-10 pr-3 py-3 border ${signupErrors.name ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  id="signup-name" placeholder="John Doe" /></div>
                {signupErrors.name && <p className="text-red-500 text-xs">{signupErrors.name}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="signup-email">University Email</label>
                <div className="relative group"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary text-sm">school</span></div>
                <input value={signupForm.email} onChange={e => { setSignupForm(p => ({...p, email: e.target.value})); setSignupErrors(p => ({...p, email: ''})); }}
                  className={`block w-full pl-10 pr-3 py-3 border ${signupErrors.email ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  id="signup-email" placeholder="yourname@university.edu" type="email" /></div>
                {signupErrors.email && <p className="text-red-500 text-xs">{signupErrors.email}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="signup-phone">Phone Number</label>
                <div className="relative group"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary text-sm">phone</span></div>
                <input value={signupForm.phone} onChange={e => { setSignupForm(p => ({...p, phone: e.target.value})); setSignupErrors(p => ({...p, phone: ''})); }}
                  className={`block w-full pl-10 pr-3 py-3 border ${signupErrors.phone ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  id="signup-phone" placeholder="+91 98765 43210" type="tel" /></div>
                {signupErrors.phone && <p className="text-red-500 text-xs">{signupErrors.phone}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="signup-password">Password</label>
                <div className="relative group"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary text-sm">lock</span></div>
                <input value={signupForm.password} onChange={e => { setSignupForm(p => ({...p, password: e.target.value})); setSignupErrors(p => ({...p, password: ''})); }}
                  className={`block w-full pl-10 pr-3 py-3 border ${signupErrors.password ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  id="signup-password" placeholder="Min. 8 characters" type="password" /></div>
                {signupErrors.password && <p className="text-red-500 text-xs">{signupErrors.password}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="signup-confirm-password">Confirm Password</label>
                <div className="relative group"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary text-sm">lock</span></div>
                <input value={signupForm.confirmPassword} onChange={e => { setSignupForm(p => ({...p, confirmPassword: e.target.value})); setSignupErrors(p => ({...p, confirmPassword: ''})); }}
                  className={`block w-full pl-10 pr-3 py-3 border ${signupErrors.confirmPassword ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  id="signup-confirm-password" placeholder="Re-enter password" type="password" /></div>
                {signupErrors.confirmPassword && <p className="text-red-500 text-xs">{signupErrors.confirmPassword}</p>}
              </div>
              <button type="submit" disabled={signupLoading}
                className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform active:scale-[0.98] disabled:opacity-50 cursor-pointer">
                {signupLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest"><span className="bg-background-light dark:bg-background-dark px-4 text-slate-400">Or continue with</span></div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-sm font-bold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-primary text-xl">account_balance</span>
              <span className="text-sm font-bold">EduID</span>
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-4">
            {activeTab === 'login' ? (
              <>Don&apos;t have an account? <button className="text-primary font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('signup')}>Sign up</button></>
            ) : (
              <>Already have an account? <button className="text-primary font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('login')}>Log in</button></>
            )}
          </p>
        </div>
      </div>

      {/* Dark mode toggle - desktop */}
      <button onClick={toggle} className="hidden lg:flex fixed top-6 right-6 z-50 items-center gap-2 bg-slate-900/80 dark:bg-slate-100/80 text-white dark:text-slate-900 px-4 py-2 rounded-full shadow-lg text-sm font-bold cursor-pointer backdrop-blur-sm">
        <span className="material-symbols-outlined text-lg">{dark ? 'light_mode' : 'dark_mode'}</span>
        {dark ? 'Light' : 'Dark'}
      </button>

      {/* Help */}
      <div className="fixed bottom-4 right-4 lg:right-12">
        <button className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-full shadow-lg text-sm font-bold cursor-pointer">
          <span className="material-symbols-outlined text-lg">help</span>Help &amp; Support
        </button>
      </div>
    </div>
  );
}
