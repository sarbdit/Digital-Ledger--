
import React, { useMemo, useState } from 'react';
import { useLedger } from '../contexts/LedgerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { TransactionType, Contact } from '../types';
import { generateFinancialSummary } from '../services/geminiService';
import SummaryCard from './shared/SummaryCard';
import Modal from './shared/Modal';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { state, updateContact } = useLedger();
  const { t } = useLanguage();
  const { transactions, contacts } = state;
  const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const stats = useMemo(() => {
    const totalCredit = transactions
      .filter((t) => t.type === TransactionType.CREDIT)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = transactions
      .filter((t) => t.type === TransactionType.DEBIT)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = contacts.reduce((sum, c) => sum + c.balance, 0);

    const customersOwe = contacts
        .filter(c => c.type === 'customer' && c.balance > 0)
        .reduce((sum, c) => sum + c.balance, 0);

    const youOwe = contacts
        .filter(c => c.type === 'supplier' && c.balance < 0)
        .reduce((sum, c) => sum + c.balance, 0);


    return { totalCredit, totalDebit, netBalance, customersOwe, youOwe: Math.abs(youOwe) };
  }, [transactions, contacts]);

  const upcomingReminders = useMemo(() => {
    const todayISO = new Date().toISOString().split('T')[0];
    
    return contacts.filter(c => {
        if (!c.reminderDate) return false;
        
        const isDue = c.reminderDate <= todayISO;
        const hasRelevantBalance = (c.type === 'customer' && c.balance > 0) || (c.type === 'supplier' && c.balance < 0);
        
        return isDue && hasRelevantBalance;
    }).sort((a,b) => a.reminderDate!.localeCompare(b.reminderDate!));
  }, [contacts]);

  const handleSendReminder = (contact: Contact) => {
    const message = contact.type === 'customer'
        ? t('dashboardPage.mockReminderSent', { name: contact.name, amount: contact.balance.toFixed(2) })
        : t('dashboardPage.mockPaymentNotificationSent', { name: contact.name, amount: Math.abs(contact.balance).toFixed(2) });
    
    alert(message);

    // After sending, clear the reminder date
    const updatedContact = { ...contact };
    delete updatedContact.reminderDate;
    updateContact(updatedContact);
  };

  const handleGenerateSummary = async () => {
    setSummaryModalOpen(true);
    setIsLoadingSummary(true);
    const result = await generateFinancialSummary(transactions, contacts);
    setSummary(result);
    setIsLoadingSummary(false);
  };
  
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const getContactName = (contactId: string) => {
    return contacts.find(c => c.id === contactId)?.name || t('unknownContact');
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
            title={t('dashboardPage.customersOweYou')} 
            value={`৳${stats.customersOwe.toFixed(2)}`} 
            icon="fa-solid fa-arrow-down"
            color="text-green-500"
            bgColor="bg-green-100 dark:bg-green-900"
        />
        <SummaryCard 
            title={t('dashboardPage.youOweSuppliers')} 
            value={`৳${stats.youOwe.toFixed(2)}`} 
            icon="fa-solid fa-arrow-up"
            color="text-red-500"
            bgColor="bg-red-100 dark:bg-red-900"
        />
        <SummaryCard 
            title={t('dashboardPage.totalCredit')} 
            value={`৳${stats.totalCredit.toFixed(2)}`} 
            icon="fa-solid fa-plus"
            color="text-blue-500"
            bgColor="bg-blue-100 dark:bg-blue-900"
        />
        <SummaryCard 
            title={t('dashboardPage.totalDebit')} 
            value={`৳${stats.totalDebit.toFixed(2)}`} 
            icon="fa-solid fa-minus"
            color="text-yellow-500"
            bgColor="bg-yellow-100 dark:bg-yellow-900"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleGenerateSummary} 
          className="w-full sm:w-auto flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          {t('dashboardPage.generateAISummary')}
        </button>
         <Link to="/transactions" state={{ openModal: true, type: TransactionType.CREDIT }} className="w-full sm:w-auto flex-1 text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out">
          <i className="fa-solid fa-plus mr-2"></i> {t('dashboardPage.addCredit')}
        </Link>
        <Link to="/transactions" state={{ openModal: true, type: TransactionType.DEBIT }} className="w-full sm:w-auto flex-1 text-center bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out">
          <i className="fa-solid fa-minus mr-2"></i> {t('dashboardPage.addDebit')}
        </Link>
      </div>

      {upcomingReminders.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-orange-500 flex items-center gap-2">
                <i className="fa-solid fa-bell animate-pulse"></i>
                {t('dashboardPage.paymentReminders')}
              </h2>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {upcomingReminders.map(contact => (
                      <li key={contact.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                              <p className="font-medium text-gray-900 dark:text-white">{contact.name}
                                <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${contact.type === 'customer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>{t(contact.type)}</span>
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('dashboardPage.dueOn', { date: new Date(contact.reminderDate + 'T00:00:00').toLocaleDateString() })}
                              </p>
                          </div>
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                              <span className={`text-lg font-bold ${contact.balance > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  ৳{Math.abs(contact.balance).toFixed(2)}
                              </span>
                              <button
                                  onClick={() => handleSendReminder(contact)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-3 rounded-lg text-sm flex items-center gap-2"
                              >
                                  <i className="fa-solid fa-paper-plane"></i> {t('dashboardPage.send')}
                              </button>
                          </div>
                      </li>
                  ))}
              </ul>
          </div>
      )}
      
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('dashboardPage.recentTransactions')}</h2>
        <div className="overflow-x-auto">
          {recentTransactions.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map(t => (
                <li key={t.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{getContactName(t.contactId)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div className={`text-lg font-bold ${t.type === TransactionType.CREDIT ? 'text-green-500' : 'text-red-500'}`}>
                    {t.type === TransactionType.CREDIT ? '+' : '-'} ৳{t.amount.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('dashboardPage.noRecentTransactions')}</p>
          )}
        </div>
      </div>

      <Modal isOpen={isSummaryModalOpen} onClose={() => setSummaryModalOpen(false)} title={t('dashboardPage.aiFinancialSummary')}>
        {isLoadingSummary ? (
          <div className="flex justify-center items-center h-48">
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
