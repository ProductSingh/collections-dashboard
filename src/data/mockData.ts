export interface PaymentHistory {
  date: string;
  amount: number;
  status: 'Paid' | 'Missed' | 'Partial';
}

export interface ActiveLoan {
  loanId: string;
  product: string;
  balance: number;
  termRemaining: string;
}

export interface Customer {
  customerId: string;
  businessName: string;
  contact: string;
  loanProduct: string;
  loanId: string;
  amountDue: number;
  dueDate: string;
  daysOverdue: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  otherActiveLoans: ActiveLoan[];
  lastPaymentDate: string;
  history: PaymentHistory[];
}

export const mockCustomers: Customer[] = [
  {
    customerId: "C001",
    businessName: "John's Plumbing Pty Ltd",
    contact: "+61 400 123 456",
    loanProduct: "Business Cash Advance",
    loanId: "L001-01",
    amountDue: 12500,
    dueDate: "2025-09-15",
    daysOverdue: 21,
    riskLevel: "High",
    otherActiveLoans: [
      { loanId: "L001-02", product: "Equipment Finance", balance: 15000, termRemaining: "6 months" }
    ],
    lastPaymentDate: "2025-07-10",
    history: [
      { date: "2025-07-10", amount: 3000, status: "Paid" },
      { date: "2025-08-10", amount: 3000, status: "Missed" },
      { date: "2025-09-10", amount: 3000, status: "Missed" }
    ]
  },
  {
    customerId: "C002",
    businessName: "Smith & Sons Construction",
    contact: "+61 411 234 567",
    loanProduct: "Invoice Finance",
    loanId: "L002-01",
    amountDue: 8750,
    dueDate: "2025-09-25",
    daysOverdue: 11,
    riskLevel: "Medium",
    otherActiveLoans: [
      { loanId: "L002-02", product: "Business Cash Advance", balance: 22000, termRemaining: "9 months" }
    ],
    lastPaymentDate: "2025-08-15",
    history: [
      { date: "2025-07-15", amount: 2500, status: "Paid" },
      { date: "2025-08-15", amount: 2500, status: "Paid" },
      { date: "2025-09-15", amount: 2500, status: "Missed" }
    ]
  },
  {
    customerId: "C003",
    businessName: "Green Valley Landscaping",
    contact: "+61 422 345 678",
    loanProduct: "Equipment Finance",
    loanId: "L003-01",
    amountDue: 5200,
    dueDate: "2025-09-28",
    daysOverdue: 8,
    riskLevel: "Low",
    otherActiveLoans: [],
    lastPaymentDate: "2025-09-01",
    history: [
      { date: "2025-07-01", amount: 1300, status: "Paid" },
      { date: "2025-08-01", amount: 1300, status: "Paid" },
      { date: "2025-09-01", amount: 1300, status: "Paid" },
      { date: "2025-09-28", amount: 1300, status: "Missed" }
    ]
  },
  {
    customerId: "C004",
    businessName: "TechStart Solutions",
    contact: "+61 433 456 789",
    loanProduct: "Business Cash Advance",
    loanId: "L004-01",
    amountDue: 18900,
    dueDate: "2025-09-10",
    daysOverdue: 26,
    riskLevel: "High",
    otherActiveLoans: [
      { loanId: "L004-02", product: "Invoice Finance", balance: 12000, termRemaining: "4 months" },
      { loanId: "L004-03", product: "Equipment Finance", balance: 8500, termRemaining: "12 months" }
    ],
    lastPaymentDate: "2025-06-20",
    history: [
      { date: "2025-06-20", amount: 4500, status: "Paid" },
      { date: "2025-07-20", amount: 4500, status: "Missed" },
      { date: "2025-08-20", amount: 4500, status: "Missed" }
    ]
  },
  {
    customerId: "C005",
    businessName: "Cafe Delicious",
    contact: "+61 444 567 890",
    loanProduct: "Invoice Finance",
    loanId: "L005-01",
    amountDue: 3400,
    dueDate: "2025-09-30",
    daysOverdue: 6,
    riskLevel: "Low",
    otherActiveLoans: [],
    lastPaymentDate: "2025-09-10",
    history: [
      { date: "2025-08-10", amount: 1700, status: "Paid" },
      { date: "2025-09-10", amount: 1700, status: "Paid" },
      { date: "2025-09-30", amount: 1700, status: "Missed" }
    ]
  },
  {
    customerId: "C006",
    businessName: "Metro Auto Repairs",
    contact: "+61 455 678 901",
    loanProduct: "Equipment Finance",
    loanId: "L006-01",
    amountDue: 9800,
    dueDate: "2025-09-20",
    daysOverdue: 16,
    riskLevel: "Medium",
    otherActiveLoans: [
      { loanId: "L006-02", product: "Business Cash Advance", balance: 18000, termRemaining: "7 months" }
    ],
    lastPaymentDate: "2025-08-05",
    history: [
      { date: "2025-07-05", amount: 2450, status: "Paid" },
      { date: "2025-08-05", amount: 2450, status: "Paid" },
      { date: "2025-09-05", amount: 2450, status: "Missed" }
    ]
  },
  {
    customerId: "C007",
    businessName: "Bright Spark Electrical",
    contact: "+61 466 789 012",
    loanProduct: "Business Cash Advance",
    loanId: "L007-01",
    amountDue: 14200,
    dueDate: "2025-09-18",
    daysOverdue: 18,
    riskLevel: "High",
    otherActiveLoans: [],
    lastPaymentDate: "2025-07-25",
    history: [
      { date: "2025-07-25", amount: 3550, status: "Paid" },
      { date: "2025-08-25", amount: 3550, status: "Missed" },
      { date: "2025-09-18", amount: 3550, status: "Missed" }
    ]
  },
  {
    customerId: "C008",
    businessName: "The Print Shop",
    contact: "+61 477 890 123",
    loanProduct: "Invoice Finance",
    loanId: "L008-01",
    amountDue: 6100,
    dueDate: "2025-09-27",
    daysOverdue: 9,
    riskLevel: "Medium",
    otherActiveLoans: [
      { loanId: "L008-02", product: "Equipment Finance", balance: 9500, termRemaining: "8 months" }
    ],
    lastPaymentDate: "2025-08-28",
    history: [
      { date: "2025-07-28", amount: 2033, status: "Paid" },
      { date: "2025-08-28", amount: 2033, status: "Paid" },
      { date: "2025-09-27", amount: 2034, status: "Missed" }
    ]
  }
];
