import { useState, useMemo } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import { Customer } from '../data/mockData';

interface AccountsTableProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

type SortField = 'businessName' | 'amountDue' | 'daysOverdue' | 'riskLevel';
type SortDirection = 'asc' | 'desc';

export default function AccountsTable({ customers, onSelectCustomer }: AccountsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('daysOverdue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.customerId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'all' || customer.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [customers, searchTerm, sortField, sortDirection, riskFilter]);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">Overdue Accounts</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
              />
            </div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('businessName')}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider hover:text-slate-900"
                >
                  Business Name
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Loan Product
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('amountDue')}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider hover:text-slate-900"
                >
                  Amount Due
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('daysOverdue')}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider hover:text-slate-900"
                >
                  Days Overdue
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('riskLevel')}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider hover:text-slate-900"
                >
                  Risk Level
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Other Loans
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredAndSortedCustomers.map((customer) => (
              <tr
                key={customer.customerId}
                onClick={() => onSelectCustomer(customer)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{customer.businessName}</div>
                  <div className="text-sm text-slate-500">{customer.customerId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {customer.contact}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {customer.loanProduct}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                  ${customer.amountDue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {customer.dueDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-red-600">
                    {customer.daysOverdue} days
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBadgeColor(customer.riskLevel)}`}>
                    {customer.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {customer.otherActiveLoans.length > 0 ? (
                    <span className="font-semibold">{customer.otherActiveLoans.length}</span>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedCustomers.length === 0 && (
        <div className="p-8 text-center text-slate-500">
          No accounts found matching your criteria
        </div>
      )}
    </div>
  );
}
