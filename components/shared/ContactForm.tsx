
import React, { useState, useEffect } from 'react';
import { Contact } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import Modal from './Modal';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<Contact, 'id' | 'balance'>) => void;
  existingContact: Contact | null;
  contactType: 'customer' | 'supplier';
}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose, onSave, existingContact, contactType }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  useEffect(() => {
    if (existingContact) {
      setName(existingContact.name);
      setPhone(existingContact.phone);
      setEmail(existingContact.email || '');
      setAddress(existingContact.address || '');
      setReminderDate(existingContact.reminderDate || '');
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setReminderDate('');
    }
  }, [existingContact, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert(t('contactForm.alertNameAndPhoneRequired'));
      return;
    }
    onSave({ name, phone, email, address, type: contactType, reminderDate: reminderDate || undefined });
  };

  const titleKey = `${existingContact ? 'edit' : 'add'}${contactType === 'customer' ? 'Customer' : 'Supplier'}`;
  const title = t(`contactForm.${titleKey}`);

  const showReminderInput = existingContact && (
      (contactType === 'customer' && existingContact.balance > 0) ||
      (contactType === 'supplier' && existingContact.balance < 0)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('name')}</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('phone')}</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contactForm.emailOptional')}</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contactForm.addressOptional')}</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        {showReminderInput && (
          <div>
            <label htmlFor="reminderDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contactForm.setPaymentReminder')}</label>
            <input
              type="date"
              id="reminderDate"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        )}
        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
            {t('cancel')}
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
            {t(`contactForm.save${contactType === 'customer' ? 'Customer' : 'Supplier'}`)}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactForm;
