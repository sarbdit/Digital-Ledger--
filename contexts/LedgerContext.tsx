
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { LedgerState, LedgerAction, Contact, Transaction, TransactionType } from '../types';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'tallyKhataLedger';

const initialState: LedgerState = {
  contacts: [],
  transactions: [],
};

const ledgerReducer = (state: LedgerState, action: LedgerAction): LedgerState => {
  switch (action.type) {
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.payload),
        transactions: state.transactions.filter((t) => t.contactId !== action.payload),
      };
    case 'ADD_TRANSACTION': {
      const { contactId, amount, type } = action.payload;
      const newContacts = state.contacts.map((contact) => {
        if (contact.id === contactId) {
          // Corrected Logic:
          // DEBIT ('I Gave') increases debt (for customers) or decreases what I owe (for suppliers).
          // CREDIT ('I Got') decreases debt (for customers) or increases what I owe (for suppliers).
          const newBalance = type === TransactionType.DEBIT ? contact.balance + amount : contact.balance - amount;
          return { ...contact, balance: newBalance };
        }
        return contact;
      });
      return {
        ...state,
        contacts: newContacts,
        transactions: [...state.transactions, action.payload],
      };
    }
    case 'DELETE_TRANSACTION': {
        const { transactionId, contactId, amount, type } = action.payload;
        const newContacts = state.contacts.map((contact) => {
          if (contact.id === contactId) {
            // Corrected Logic: Revert the transaction
            const newBalance = type === TransactionType.DEBIT ? contact.balance - amount : contact.balance + amount;
            return { ...contact, balance: newBalance };
          }
          return contact;
        });
        return {
          ...state,
          contacts: newContacts,
          transactions: state.transactions.filter((t) => t.id !== transactionId),
        };
      }
    case 'SET_STATE':
        return action.payload;
    default:
      return state;
  }
};

interface LedgerContextProps {
  state: LedgerState;
  dispatch: React.Dispatch<LedgerAction>;
  addContact: (contact: Omit<Contact, 'id' | 'balance'>) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (transaction: Transaction) => void;
  getContactById: (id: string) => Contact | undefined;
}

const LedgerContext = createContext<LedgerContextProps | undefined>(undefined);

export const LedgerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ledgerReducer, initialState);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        dispatch({ type: 'SET_STATE', payload: JSON.parse(storedState) });
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [state]);

  const addContact = (contact: Omit<Contact, 'id' | 'balance'>) => {
    const newContact: Contact = { ...contact, id: uuidv4(), balance: 0 };
    dispatch({ type: 'ADD_CONTACT', payload: newContact });
  };

  const updateContact = (contact: Contact) => {
    dispatch({ type: 'UPDATE_CONTACT', payload: contact });
  };
  
  const deleteContact = (id: string) => {
    dispatch({ type: 'DELETE_CONTACT', payload: id });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { ...transaction, id: uuidv4() };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const deleteTransaction = (transaction: Transaction) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: { transactionId: transaction.id, contactId: transaction.contactId, amount: transaction.amount, type: transaction.type } });
  };

  const getContactById = (id: string) => {
    return state.contacts.find(c => c.id === id);
  }

  return (
    <LedgerContext.Provider value={{ state, dispatch, addContact, updateContact, deleteContact, addTransaction, deleteTransaction, getContactById }}>
      {children}
    </LedgerContext.Provider>
  );
};

export const useLedger = (): LedgerContextProps => {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
};
