import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contact } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  contactType: 'customer' | 'supplier';
  totalBalance: number;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onEdit, onDelete, contactType, totalBalance }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleRowClick = (contactId: string) => {
    navigate('/transactions', { state: { contactId } });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('name')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('phone')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('balance')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {contacts.map((contact) => (
              <tr 
                key={contact.id} 
                onClick={() => handleRowClick(contact.id)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-opacity duration-300"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{contact.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-semibold ${contact.balance > 0 ? 'text-green-600' : contact.balance < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                    {(contact.balance > 0 && contactType === 'supplier') || (contact.balance < 0 && contactType === 'customer') ? `${t('advance')} ` : ''}
                    ৳{Math.abs(contact.balance).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(contact);
                    }} 
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(contact.id);
                    }} 
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 dark:bg-gray-700">
            <tr>
                <td colSpan={2} className="px-6 py-3 text-right text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">
                    {contactType === 'customer' ? t('contactsPage.totalOwedByCustomers') : t('contactsPage.totalOwedToSuppliers')}
                </td>
                <td className={`px-6 py-3 text-right text-sm font-bold ${totalBalance > 0 ? 'text-green-700 dark:text-green-400' : totalBalance < 0 ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}`}>
                    ৳{Math.abs(totalBalance).toFixed(2)}
                </td>
                <td className="px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
        {contacts.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t(`contactsPage.no${contactType === 'customer' ? 'Customers' : 'Suppliers'}Found`)}</p>
        )}
      </div>
    </div>
  );
};

export default ContactList;