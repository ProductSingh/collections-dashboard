import { TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';

interface MetricsPanelProps {
  totalAccounts: number;
  contactedAccounts: number;
  totalOverdue: number;
  ptpPercentage: number;
}

export default function MetricsPanel({
  totalAccounts,
  contactedAccounts,
  totalOverdue,
  ptpPercentage
}: MetricsPanelProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-50">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-slate-600 text-xs font-medium mb-1">Total Overdue Accounts</p>
            <p className="text-2xl font-bold text-slate-900">{totalAccounts}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-50">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-slate-600 text-xs font-medium mb-1">Accounts Contacted</p>
            <p className="text-2xl font-bold text-slate-900">{contactedAccounts}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-orange-50">
            <DollarSign className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-slate-600 text-xs font-medium mb-1">Total Amount Due</p>
            <p className="text-2xl font-bold text-slate-900">${totalOverdue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-teal-50">
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="text-slate-600 text-xs font-medium mb-1">Promise-to-Pay Rate</p>
            <p className="text-2xl font-bold text-slate-900">{ptpPercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
