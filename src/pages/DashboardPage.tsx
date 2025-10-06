import { useState, useMemo } from 'react';
import { LogOut, ArrowLeft } from 'lucide-react';
import { Customer, mockCustomers } from '../data/mockData';
import MetricsPanel from '../components/MetricsPanel';
import AccountsTable from '../components/AccountsTable';
import CustomerDetailPage from './CustomerDetailPage';

interface DashboardPageProps {
  onLogout: () => void;
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [contactedAccounts] = useState<Set<string>>(new Set(['C001', 'C003', 'C005']));

  const metrics = useMemo(() => {
    const totalAccounts = mockCustomers.length;
    const contacted = contactedAccounts.size;
    const totalOverdue = mockCustomers.reduce((sum, customer) => sum + customer.amountDue, 0);
    const ptpPercentage = totalAccounts > 0 ? Math.round((contacted / totalAccounts) * 100) : 0;

    return {
      totalAccounts,
      contactedAccounts: contacted,
      totalOverdue,
      ptpPercentage
    };
  }, [contactedAccounts]);

  if (selectedCustomer) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <h1 className="text-xl font-bold text-slate-900">Bizcap Collections AI</h1>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CustomerDetailPage
            customer={selectedCustomer}
            onBack={() => setSelectedCustomer(null)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">Bizcap Collections AI</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-base text-slate-700">Hi Agent</h2>
        </div>

        <MetricsPanel
          totalAccounts={metrics.totalAccounts}
          contactedAccounts={metrics.contactedAccounts}
          totalOverdue={metrics.totalOverdue}
          ptpPercentage={metrics.ptpPercentage}
        />

        <AccountsTable
          customers={mockCustomers}
          onSelectCustomer={setSelectedCustomer}
        />
      </main>
    </div>
  );
}
