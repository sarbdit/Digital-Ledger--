
import React, { useMemo, useState } from 'react';
import { useLedger } from '../contexts/LedgerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Transaction, TransactionType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports: React.FC = () => {
  const { state } = useLedger();
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState('monthly'); // 'daily', 'weekly', 'monthly'

  const chartData = useMemo(() => {
    const now = new Date();
    let filteredTransactions: Transaction[] = [];

    if (timeframe === 'daily') {
        const today = now.toISOString().split('T')[0];
        filteredTransactions = state.transactions.filter(t => t.date.startsWith(today));
    } else if (timeframe === 'weekly') {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        filteredTransactions = state.transactions.filter(t => new Date(t.date) >= startOfWeek);
    } else { // monthly
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredTransactions = state.transactions.filter(t => new Date(t.date) >= startOfMonth);
    }

    const dataMap = new Map<string, { name: string; credit: number; debit: number }>();

    filteredTransactions.forEach(t => {
      const dateKey = new Date(t.date).toLocaleDateString();
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { name: dateKey, credit: 0, debit: 0 });
      }
      const entry = dataMap.get(dateKey)!;
      if (t.type === TransactionType.CREDIT) {
        entry.credit += t.amount;
      } else {
        entry.debit += t.amount;
      }
    });

    return Array.from(dataMap.values());
  }, [state.transactions, timeframe]);

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{t('reports')}</h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('reportsPage.incomeVsExpense')}</h2>
                <div className="flex gap-2 mt-4 sm:mt-0">
                    <button onClick={() => setTimeframe('daily')} className={`px-4 py-2 rounded-lg ${timeframe === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('reportsPage.daily')}</button>
                    <button onClick={() => setTimeframe('weekly')} className={`px-4 py-2 rounded-lg ${timeframe === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('reportsPage.weekly')}</button>
                    <button onClick={() => setTimeframe('monthly')} className={`px-4 py-2 rounded-lg ${timeframe === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('reportsPage.monthly')}</button>
                </div>
            </div>
            
            {chartData.length > 0 ? (
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                                border: '1px solid #4B5563', // border-gray-600
                                color: '#F9FAFB' // text-gray-50
                            }}
                        />
                        <Legend />
                        <Bar dataKey="credit" fill="#22c55e" name={t('reportsPage.creditIncome')} />
                        <Bar dataKey="debit" fill="#ef4444" name={t('reportsPage.debitExpense')} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-16">{t('reportsPage.noDataForTimeframe')}</p>
            )}
        </div>
    </div>
  );
};

export default Reports;
