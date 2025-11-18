
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LedgerProvider } from './contexts/LedgerContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import Transactions from './components/Transactions';
import Reports from './components/Reports';
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import BottomNav from './components/shared/BottomNav';
import Login from './components/Login';
import SettingsModal from './components/shared/SettingsModal';

// This is a mock authentication check. In a real app, you'd use a proper auth provider.
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('companyLogo'); // Also clear logo on logout
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

const App: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);
  
  const handleSetLogo = (logoData: string | null) => {
    if (logoData) {
      localStorage.setItem('companyLogo', logoData);
    } else {
      localStorage.removeItem('companyLogo');
    }
    setLogo(logoData);
    setIsSettingsOpen(false); // Close modal on save/remove
  };


  if (!isAuthenticated) {
    return (
      <LanguageProvider>
         <Login onLogin={login} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <LedgerProvider>
        <HashRouter>
          <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header 
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                onLogout={logout}
                logo={logo}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 pb-20 md:pb-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/reports" element={<Reports />} />
                  </Routes>
                </div>
              </main>
              <BottomNav />
            </div>
          </div>
          <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            currentLogo={logo}
            onSaveLogo={handleSetLogo}
          />
        </HashRouter>
      </LedgerProvider>
    </LanguageProvider>
  );
};

export default App;
