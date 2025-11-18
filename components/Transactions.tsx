import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLedger } from '../contexts/LedgerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Transaction, TransactionType, Contact } from '../types';
import TransactionForm from './shared/TransactionForm';
import InvoiceModal from './shared/InvoiceModal';

const Transactions: React.FC = () => {
  const { state, addTransaction, deleteTransaction, getContactById } = useLedger();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>(TransactionType.CREDIT);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContactId, setFilteredContactId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State for invoice generation
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<string[]>([]);
  const [invoiceContactId, setInvoiceContactId] = useState<string | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{
    transactions: Transaction[],
    contact: Contact | undefined,
    logo: string | null
} | null>(null);

  useEffect(() => {
    if (location.state?.openModal) {
      setModalType(location.state.type || TransactionType.CREDIT);
      setIsModalOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    // Sync the filter ID from the navigation state when it changes.
    setFilteredContactId(location.state?.contactId || null);
  }, [location.state?.contactId]);


  const handleAddTransaction = (type: TransactionType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSave = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    setIsModalOpen(false);
  };

  const handleDelete = (transaction: Transaction) => {
    if (window.confirm(t('transactionsPage.deleteTransactionConfirmation'))) {
        deleteTransaction(transaction);
    }
  };
  
  const handleClearContactFilter = () => {
    setFilteredContactId(null);
    setSelectedTransactionIds([]);
    setInvoiceContactId(null);
    // Also clear the location state so that if the user reloads, the filter doesn't come back.
    navigate(location.pathname, { replace: true }); 
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setStartDate('');
    setEndDate('');
  };
  
  const setDateRange = (period: 'today' | 'week' | 'month') => {
    const end = new Date();
    let start = new Date();

    if (period === 'today') {
        start = new Date();
    } else if (period === 'week') {
        const day = end.getDay();
        start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - day + (day === 0 ? -6 : 1) ); // Week starts on Monday
    } else if (period === 'month') {
        start = new Date(end.getFullYear(), end.getMonth(), 1);
    }
    
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };


  const filteredTransactions = useMemo(() => {
    return state.transactions
      .map(transaction => ({ ...transaction, contactName: getContactById(transaction.contactId)?.name || t('unknownContact') }))
      .filter(t => {
          const matchesSearch = t.contactName.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesContactFilter = filteredContactId ? t.contactId === filteredContactId : true;
          
          const matchesType = filterType === 'all' ? true : t.type === filterType;
              
          const transactionDate = t.date.substring(0, 10);
          const matchesStartDate = startDate ? transactionDate >= startDate : true;
          const matchesEndDate = endDate ? transactionDate <= endDate : true;

          return matchesSearch && matchesContactFilter && matchesType && matchesStartDate && matchesEndDate;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.transactions, searchTerm, getContactById, filteredContactId, t, filterType, startDate, endDate]);
  
  const filteredContactName = useMemo(() => {
    if (!filteredContactId) return null;
    return getContactById(filteredContactId)?.name;
  }, [filteredContactId, getContactById]);
  
  const handleSelectTransaction = (transactionId: string, contactId: string) => {
    const isSelected = selectedTransactionIds.includes(transactionId);
    let newSelectedIds = [...selectedTransactionIds];

    if (isSelected) {
        newSelectedIds = newSelectedIds.filter(id => id !== transactionId);
    } else {
        newSelectedIds.push(transactionId);
    }

    setSelectedTransactionIds(newSelectedIds);

    if (newSelectedIds.length > 0) {
        setInvoiceContactId(contactId);
    } else {
        setInvoiceContactId(null);
    }
  };
  
  const handleGenerateInvoice = () => {
    const transactions = state.transactions.filter(t => selectedTransactionIds.includes(t.id));
    const contact = getContactById(invoiceContactId!);
    const logo = localStorage.getItem('companyLogo');
    setInvoiceData({ transactions, contact, logo });
    setIsInvoiceModalOpen(true);
  };
  
  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setSelectedTransactionIds([]);
    setInvoiceContactId(null);
    setInvoiceData(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {filteredContactName ? (
           <div className="flex items-center gap-4">
             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
                {t('transactionsPage.transactionsFor', { name: filteredContactName })}
             </h1>
             <button onClick={handleClearContactFilter} className="text-sm text-red-500 hover:text-red-700 font-semibold">
                {t('transactionsPage.clearFilter')}
             </button>
           </div>
        ) : (
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{t('transactionsPage.allTransactions')}</h1>
        )}
        <div className="flex gap-2">
            {selectedTransactionIds.length > 0 && (
                <button 
                  onClick={handleGenerateInvoice} 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200"
                >
                    <i className="fas fa-file-invoice"></i> 
                    {t('transactionsPage.generateInvoice', { count: selectedTransactionIds.length })}
                </button>
            )}
            <button onClick={() => handleAddTransaction(TransactionType.CREDIT)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                <i className="fas fa-plus"></i> {t('credit')}
            </button>
            <button onClick={() => handleAddTransaction(TransactionType.DEBIT)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                <i className="fas fa-minus"></i> {t('debit')}
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20">
        <div className="md:col-span-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('searchByContactName')}</label>
            <input
                id="search"
                type="text"
                placeholder={t('searchByContactName')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="md:col-span-1">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('transactionsPage.filterByType')}</label>
            <select
                id="type-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | TransactionType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">{t('transactionsPage.allTypes')}</option>
                <option value={TransactionType.CREDIT}>{t('credit')}</option>
                <option value={TransactionType.DEBIT}>{t('debit')}</option>
            </select>
        </div>
        
        <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('transactionsPage.filterByDate')}</label>
                 <div className="flex items-center gap-2">
                    <button onClick={() => setDateRange('today')} className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">{t('transactionsPage.today')}</button>
                    <button onClick={() => setDateRange('week')} className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">{t('transactionsPage.thisWeek')}</button>
                    <button onClick={() => setDateRange('month')} className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">{t('transactionsPage.thisMonth')}</button>
                 </div>
            </div>
            <div className="flex gap-4">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={t('transactionsPage.startDate')}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={t('transactionsPage.endDate')}
                />
            </div>
        </div>
        
        <div className="md:col-span-4 flex justify-end">
            <button onClick={handleResetFilters} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                <i className="fas fa-times"></i> {t('transactionsPage.resetFilters')}
            </button>
        </div>
      </div>


      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('date')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('transactionForm.contact')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('type')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('amount')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('notes')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-4">
                    <input
                        type="checkbox"
                        checked={selectedTransactionIds.includes(t.id)}
                        onChange={() => handleSelectTransaction(t.id, t.contactId)}
                        disabled={(invoiceContactId !== null && t.contactId !== invoiceContactId) || t.type === TransactionType.DEBIT}
                        title={t.type === TransactionType.DEBIT ? t('transactionsPage.invoiceCheckboxDisabledTooltip') : ""}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{new Date(t.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{t.contactName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    t.type === TransactionType.CREDIT
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {t(t.type.toLowerCase())}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  t.type === TransactionType.CREDIT ? 'text-green-600' : 'text-red-600'
                }`}>
                  ৳{t.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{t.notes}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(t)} className="text-red-600 hover:text-red-900">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('transactionsPage.noTransactionsFound')}</p>
        )}
      </div>

      {isModalOpen && (
        <TransactionForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          transactionType={modalType}
        />
      )}
      
      {isInvoiceModalOpen && invoiceData && (
        <InvoiceModal
            isOpen={isInvoiceModalOpen}
            onClose={handleCloseInvoiceModal}
            transactions={invoiceData.transactions}
            contact={invoiceData.contact}
            logo={invoiceData.logo}
        />
      )}
    </div>
  );
};

export default Transactions;