import React from 'react';
import Modal from './Modal';
import { Transaction, Contact } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { appLogo } from '../../assets/logo';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  contact: Contact | undefined;
  logo: string | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, transactions, contact, logo }) => {
  const { t } = useLanguage();
  if (!isOpen || !contact) return null;

  const handlePrint = () => {
    const content = document.getElementById('invoice-content');
    if (!content) return;

    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow) {
        printWindow.document.write('<html><head><title>Print Invoice</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('<style>body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; } @page { margin: 20px; } </style>');
        printWindow.document.write('</head><body class="p-4">');
        printWindow.document.write(content.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus(); 
        
        // Wait for styles to load before printing
        setTimeout(() => {
             printWindow.print();
             printWindow.close();
        }, 500);
    }
  };

  const invoiceNumber = `INV-${new Date().getTime().toString().slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString();
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('invoiceModal.title', { invoiceNumber })}>
        <div id="invoice-content" className="p-2 sm:p-4 bg-white text-gray-900">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    {logo ? <img src={logo} alt="Company Logo" className="h-12 max-w-[150px] object-contain mb-2" /> : <img src={appLogo} alt="Digital Khata Logo" className="h-12 object-contain mb-2" />}
                    <p className="text-xs text-gray-600">123 Business Rd.</p>
                    <p className="text-xs text-gray-600">City, State, 12345</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold uppercase text-gray-800">{t('invoiceModal.invoiceTitle')}</h2>
                    <p className="text-sm text-gray-600 mt-1">{t('invoiceModal.invoiceNumber')} {invoiceNumber}</p>
                    <p className="text-sm text-gray-600">{t('date')}: {invoiceDate}</p>
                </div>
            </div>
            {/* Bill To */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{t('invoiceModal.billTo')}</h3>
                <p className="font-bold text-lg">{contact.name}</p>
                {contact.address && <p className="text-gray-600 text-sm">{contact.address}</p>}
                <p className="text-gray-600 text-sm">{contact.phone}</p>
                {contact.email && <p className="text-gray-600 text-sm">{contact.email}</p>}
            </div>
            {/* Items Table */}
            <table className="w-full mb-8 text-sm">
                <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="text-left font-bold text-gray-600 p-2">{t('date')}</th>
                        <th className="text-left font-bold text-gray-600 p-2">{t('invoiceModal.description')}</th>
                        <th className="text-right font-bold text-gray-600 p-2">{t('amount')}</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(t => (
                        <tr key={t.id} className="border-b border-gray-200">
                            <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="p-2">{t.notes || t('invoiceModal.notApplicable')}</td>
                            <td className="text-right p-2">৳{t.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Total */}
            <div className="flex justify-end mb-8">
                <div className="w-full max-w-xs">
                    <div className="flex justify-between font-bold text-xl bg-gray-200 p-3 rounded-md">
                        <span>{t('invoiceModal.total')}</span>
                        <span>৳{totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="text-center text-sm text-gray-600">
                <p>{t('invoiceModal.thankYou')}</p>
            </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-end gap-2 border-t dark:border-gray-700">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                {t('invoiceModal.close')}
            </button>
            <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                <i className="fas fa-print"></i> {t('invoiceModal.printInvoice')}
            </button>
        </div>
    </Modal>
  );
};

export default InvoiceModal;