
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../../types';
import { useLedger } from '../../contexts/LedgerContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Modal from './Modal';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  transactionType: TransactionType;
}

const NOTES_MAX_LENGTH = 150;

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSave, transactionType }) => {
  const { state } = useLedger();
  const { t } = useLanguage();
  const [contactId, setContactId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId || !amount || parseFloat(amount) <= 0) {
      alert(t('transactionForm.alertContactAndAmountRequired'));
      return;
    }
    onSave({
      contactId,
      amount: parseFloat(amount),
      type: transactionType,
      notes,
      date: new Date(date).toISOString(),
    });
    // Reset form
    setContactId('');
    setAmount('');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
  };
  
  const title = transactionType === TransactionType.CREDIT ? t('transactionForm.addCreditTitle') : t('transactionForm.addDebitTitle');
  const buttonClass = transactionType === TransactionType.CREDIT ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('transactionForm.contact')}</label>
          <select
            id="contact"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">{t('transactionForm.selectAContact')}</option>
            {state.contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('amount')}</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
         <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('date')}</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('transactionForm.notesOptional')}</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={NOTES_MAX_LENGTH}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          />
          <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
            {notes.length} / {NOTES_MAX_LENGTH}
          </div>
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
            {t('cancel')}
          </button>
          <button type="submit" className={`${buttonClass} text-white font-bold py-2 px-4 rounded-lg`}>
            {t('transactionForm.saveTransaction')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;
