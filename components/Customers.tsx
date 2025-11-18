import React, { useState, useMemo } from 'react';
import { useLedger } from '../contexts/LedgerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Contact } from '../types';
import ContactForm from './shared/ContactForm';
import ContactList from './shared/ContactList';

const Customers: React.FC = () => {
  const { state, addContact, updateContact, deleteContact } = useLedger();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const customers = useMemo(() => state.contacts.filter(c => c.type === 'customer'), [state.contacts]);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) {
      return customers;
    }
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  const totalBalance = useMemo(() => {
    return customers.reduce((sum, c) => sum + c.balance, 0);
  }, [customers]);

  const handleAdd = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Contact) => {
    setEditingContact(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('contactsPage.deleteCustomerConfirmation'))) {
      deleteContact(id);
    }
  };

  const handleSave = (contact: Omit<Contact, 'id' | 'balance'>) => {
    if (editingContact) {
      updateContact({ ...contact, id: editingContact.id, balance: editingContact.balance });
    } else {
      addContact(contact);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{t('customers')}</h1>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
                <input
                    type="text"
                    placeholder={t('searchByNameOrPhone')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
            <i className="fas fa-plus"></i>
            <span>{t('contactsPage.addCustomer')}</span>
            </button>
        </div>
      </div>
      
      <ContactList
        contacts={filteredCustomers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        contactType="customer"
        totalBalance={totalBalance}
      />

      {isModalOpen && (
        <ContactForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          existingContact={editingContact}
          contactType="customer"
        />
      )}
    </div>
  );
};

export default Customers;