import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { appLogo } from '../../assets/logo';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', icon: 'fa-solid fa-chart-pie', label: t('dashboard') },
    { path: '/customers', icon: 'fa-solid fa-users', label: t('customers') },
    { path: '/suppliers', icon: 'fa-solid fa-truck-moving', label: t('suppliers') },
    { path: '/transactions', icon: 'fa-solid fa-exchange-alt', label: t('allEntries') },
    { path: '/reports', icon: 'fa-solid fa-file-invoice', label: t('reports') },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 transform transition-transform md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg md:shadow-none flex flex-col`}
      >
        <div>
            <div className="flex items-center justify-center p-4 border-b dark:border-gray-700">
                <img src={appLogo} alt="Logo" className="h-10 w-10" />
                <h1 className="text-2xl font-bold ml-2 text-gray-800 dark:text-gray-200">{t('tallyKhata')}</h1>
            </div>
            <nav className="mt-5">
            {navItems.map((item) => (
                <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                    `flex items-center px-6 py-3 text-base font-medium transition-colors duration-200 ${
                    isActive
                        ? 'text-white bg-blue-600'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                }
                >
                <i className={`${item.icon} w-6 text-center`}></i>
                <span className="ml-4">{item.label}</span>
                </NavLink>
            ))}
            </nav>
        </div>
        <div className="mt-auto p-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
            {t('version')}
        </div>
      </div>
    </>
  );
};

export default Sidebar;