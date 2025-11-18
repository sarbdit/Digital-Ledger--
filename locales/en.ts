
export const en = {
  // Common
  tallyKhata: 'ডিজিটাল খাতা',
  dashboard: 'Dashboard',
  customers: 'Customers',
  suppliers: 'Suppliers',
  customer: 'Customer',
  supplier: 'Supplier',
  entries: 'Entries',
  allEntries: 'All Entries',
  reports: 'Reports',
  version: 'Version 1.0.0',
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  address: 'Address',
  notes: 'Notes',
  actions: 'Actions',
  date: 'Date',
  amount: 'Amount',
  balance: 'Balance',
  type: 'Type',
  credit: 'Credit',
  debit: 'Debit',
  cancel: 'Cancel',
  save: 'Save',
  edit: 'Edit',
  add: 'Add',
  delete: 'Delete',
  search: 'Search...',
  searchByNameOrPhone: 'Search by name or phone...',
  searchByContactName: 'Search by contact name...',
  noDataAvailable: 'No data available',
  unknownContact: 'Unknown Contact',
  advance: 'Advance',
  
  // Header
  header: {
    settings: 'Settings',
    logout: 'Logout',
  },
  
  // Dashboard
  dashboardPage: {
    customersOweYou: 'Customers Owe You',
    youOweSuppliers: 'You Owe Suppliers',
    totalCredit: 'Total Credit',
    totalDebit: 'Total Debit',
    generateAISummary: 'Generate AI Summary',
    addCredit: 'Add Credit',
    addDebit: 'Add Debit',
    paymentReminders: 'Payment Reminders',
    dueOn: 'Due on: {{date}}',
    send: 'Send',
    recentTransactions: 'Recent Transactions',
    noRecentTransactions: 'No recent transactions.',
    aiFinancialSummary: 'AI Financial Summary',
    mockReminderSent: 'Mock Reminder Sent!\n\nTo: {{name}}\nFor Amount: ${{amount}}',
    mockPaymentNotificationSent: 'Mock Payment Notification Sent!\n\nTo: {{name}}\nFor Amount: ${{amount}}',
  },

  // Customers & Suppliers Pages
  contactsPage: {
    addCustomer: 'Add Customer',
    addSupplier: 'Add Supplier',
    deleteCustomerConfirmation: 'Are you sure you want to delete this customer and all their transactions?',
    deleteSupplierConfirmation: 'Are you sure you want to delete this supplier and all their transactions?',
    noCustomersFound: 'No customers found.',
    noSuppliersFound: 'No suppliers found.',
  },

  // Transactions Page
  transactionsPage: {
    transactionsFor: 'Transactions for {{name}}',
    clearFilter: '(Clear Filter)',
    allTransactions: 'All Transactions',
    generateInvoice: 'Generate Invoice ({{count}})',
    invoiceCheckboxDisabledTooltip: 'Only CREDIT transactions can be added to an invoice',
    noTransactionsFound: 'No transactions found.',
    deleteTransactionConfirmation: 'Are you sure you want to delete this transaction? This will update the contact balance.',
    filterByType: 'Filter by Type',
    allTypes: 'All Types',
    startDate: 'Start Date',
    endDate: 'End Date',
    resetFilters: 'Reset Filters',
    filterByDate: 'Filter by Date',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
  },

  // Reports Page
  reportsPage: {
    incomeVsExpense: 'Income vs Expense',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    noDataForTimeframe: 'No data available for the selected timeframe.',
    creditIncome: 'Credit (Income)',
    debitExpense: 'Debit (Expense)',
  },

  // Login Page
  loginPage: {
    createAccount: 'Create Account',
    welcome: 'ডিজিটাল খাতা',
    joinUs: 'Join us and manage your finances',
    signInToLedger: 'Sign in to your ডিজিটাল খাতা',
    mobileNumber: 'Mobile Number',
    fullName: 'Full Name',
    emailAddress: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot your password?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    sendOtp: 'Send OTP',
    enterOtp: 'Enter OTP',
    signUpWithOtp: 'Sign Up with OTP',
    signInWithOtp: 'Sign In with OTP',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    alertFieldsPasswordMismatch: 'Please fill all fields and ensure passwords match.',
    alertNameOtp: 'Please provide your name and the OTP.',
    alertOtpSent: 'A mock OTP has been sent to {{mobileNumber}}',
    alertInvalidMobile: 'Please enter a valid mobile number.',
  },

  // Contact Form Modal
  contactForm: {
    editCustomer: 'Edit Customer',
    addCustomer: 'Add Customer',
    editSupplier: 'Edit Supplier',
    addSupplier: 'Add Supplier',
    emailOptional: 'Email (Optional)',
    addressOptional: 'Address (Optional)',
    setPaymentReminder: 'Set Payment Reminder',
    saveCustomer: 'Save Customer',
    saveSupplier: 'Save Supplier',
    alertNameAndPhoneRequired: 'Name and Phone are required.',
  },

  // Transaction Form Modal
  transactionForm: {
    addCreditTitle: 'Add Credit (I Got)',
    addDebitTitle: 'Add Debit (I Gave)',
    contact: 'Contact',
    selectAContact: 'Select a contact',
    notesOptional: 'Notes (Optional)',
    saveTransaction: 'Save Transaction',
    alertContactAndAmountRequired: 'Please select a contact and enter a valid amount.',
  },

  // Settings Modal
  settingsModal: {
    title: 'Settings',
    companyLogo: 'Company Logo',
    noLogo: 'No Logo',
    chooseLogo: 'Choose Logo',
    removeLogo: 'Remove Logo',
    saveChanges: 'Save Changes',
  },

  // Invoice Modal
  invoiceModal: {
    title: 'Invoice #{{invoiceNumber}}',
    yourCompany: 'Your Company',
    invoiceNumber: 'Invoice #:',
    billTo: 'Bill To',
    description: 'Description',
    total: 'Total',
    thankYou: 'Thank you for your business!',
    close: 'Close',
    printInvoice: 'Print Invoice',
    notApplicable: 'N/A'
  },
};
