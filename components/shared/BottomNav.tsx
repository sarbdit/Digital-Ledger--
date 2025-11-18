
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const BottomNav: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', icon: 'fa-solid fa-chart-pie', label: t('dashboard') },
    { path: '/customers', icon: 'fa-solid fa-users', label: t('customers') },
    { path: '/transactions', icon: 'fa-solid fa-exchange-alt', label: t('entries') },
    { path: '/suppliers', icon: 'fa-solid fa-truck-moving', label: t('suppliers') },
    { path: '/reports', icon: 'fa-solid fa-file-invoice', label: t('reports') },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 text-sm transition-colors duration-200 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`
            }
          >
            <i className={`${item.icon} text-xl`}></i>
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
