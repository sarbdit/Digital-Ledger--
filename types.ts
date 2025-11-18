
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number;
  type: 'customer' | 'supplier';
  reminderDate?: string; // ISO 8601 format date string (YYYY-MM-DD)
}

export enum TransactionType {
  CREDIT = 'CREDIT', // Money received / I got
  DEBIT = 'DEBIT', // Money paid / I gave
}

export interface Transaction {
  id: string;
  contactId: string;
  amount: number;
  type: TransactionType;
  notes?: string;
  date: string; // ISO 8601 format
}

export interface LedgerState {
  contacts: Contact[];
  transactions: Transaction[];
}

export type LedgerAction =
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: { transactionId: string; contactId: string; amount: number; type: TransactionType }}
  | { type: 'SET_STATE'; payload: LedgerState };