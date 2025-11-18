
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeaderProps {
  toggleSidebar: () => void;
  onLogout: () => void;
  logo: string | null;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, onLogout, logo, onOpenSettings }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-md">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="md:hidden text-gray-500 dark:text-gray-400 focus:outline-none">
          <i className="fas fa-bars text-xl"></i>
        </button>
        <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 ml-4 hidden md:flex items-center">
          {logo ? (
            <img src={logo} alt="Company Logo" className="h-8 max-w-xs" />
          ) : (
            t('tallyKhata')
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLanguage} 
          className="text-gray-600 dark:text-gray-300 font-bold hover:text-blue-500 dark:hover:text-blue-400 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-sm"
          aria-label="Toggle Language"
        >
           {language === 'en' ? 'BN' : 'EN'}
        </button>
        <button onClick={onOpenSettings} className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
           <i className="fas fa-cog text-xl"></i>
        </button>
        <button onClick={onLogout} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
          <i className="fas fa-sign-out-alt text-xl"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
