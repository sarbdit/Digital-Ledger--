import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { appLogo } from '../assets/logo';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (loginMethod === 'email') {
        if (!name.trim() || !email.trim() || password !== confirmPassword) {
          alert(t('loginPage.alertFieldsPasswordMismatch'));
          return;
        }
      } else { // mobile
        if (!name.trim() || !otp.trim()) {
          alert(t('loginPage.alertNameOtp'));
          return;
        }
      }
    }
    // In a real app, you would validate credentials or OTP here
    onLogin();
  };
  
  const handleSendOtp = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (mobileNumber.trim().length > 9) { // Simple validation
          setOtpSent(true);
          // In a real app, you'd call an API to send the OTP
          alert(t('loginPage.alertOtpSent', { mobileNumber }));
      } else {
          alert(t('loginPage.alertInvalidMobile'));
      }
  };

  const toggleFormType = () => {
    setIsSignUp(!isSignUp);
    // Reset fields
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMobileNumber('');
    setOtp('');
    setOtpSent(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <img src={appLogo} alt="Digital Khata Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{isSignUp ? t('loginPage.createAccount') : t('loginPage.welcome')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{isSignUp ? t('loginPage.joinUs') : t('loginPage.signInToLedger')}</p>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
            className={`flex-1 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 ${loginMethod === 'email' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {t('email')}
          </button>
          <button
            onClick={() => { setLoginMethod('mobile'); setOtpSent(false); }}
            className={`flex-1 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 ${loginMethod === 'mobile' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {t('loginPage.mobileNumber')}
          </button>
        </div>

        {loginMethod === 'email' ? (
          <form className="mt-6 space-y-4" onSubmit={handleAuthAction}>
            {isSignUp && (
                 <div>
                    <label htmlFor="name" className="sr-only">{t('loginPage.fullName')}</label>
                    <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder={t('loginPage.fullName')} />
                </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">{t('loginPage.emailAddress')}</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('loginPage.emailAddress')}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t('loginPage.password')}</label>
              <input id="password" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('loginPage.password')}
              />
            </div>
            {isSignUp && (
                <div>
                    <label htmlFor="confirm-password" className="sr-only">{t('loginPage.confirmPassword')}</label>
                    <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder={t('loginPage.confirmPassword')} />
                </div>
            )}
            {!isSignUp && (
                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        {t('loginPage.forgotPassword')}
                        </a>
                    </div>
                </div>
            )}
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {isSignUp ? t('loginPage.signUp') : t('loginPage.signIn')}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleAuthAction}>
             {isSignUp && (
                 <div>
                    <label htmlFor="name-mobile" className="sr-only">{t('loginPage.fullName')}</label>
                    <input id="name-mobile" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder={t('loginPage.fullName')} />
                </div>
            )}
            <div>
              <label htmlFor="mobile-number" className="sr-only">{t('loginPage.mobileNumber')}</label>
              <div className="relative">
                <input id="mobile-number" name="mobile" type="tel" autoComplete="tel" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} disabled={otpSent}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder={t('loginPage.mobileNumber')}
                />
                 {!otpSent && (
                    <button onClick={handleSendOtp} className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
                        {t('loginPage.sendOtp')}
                    </button>
                 )}
              </div>
            </div>
            {otpSent && (
              <div>
                <label htmlFor="otp" className="sr-only">{t('loginPage.enterOtp')}</label>
                <input id="otp" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" required value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={t('loginPage.enterOtp')}
                />
              </div>
            )}
             <div>
              <button type="submit" disabled={!otpSent} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                {isSignUp ? t('loginPage.signUpWithOtp') : t('loginPage.signInWithOtp')}
              </button>
            </div>
          </form>
        )}
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            {isSignUp ? t('loginPage.alreadyHaveAccount') : t('loginPage.dontHaveAccount')}
            <button onClick={toggleFormType} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1 focus:outline-none">
                {isSignUp ? t('loginPage.signIn') : t('loginPage.signUp')}
            </button>
        </p>
      </div>
    </div>
  );
};

export default Login;