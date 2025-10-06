import { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, TrendingDown, AlertCircle, CreditCard, ChevronDown, ChevronUp, Phone, Mail, Lightbulb, Clock, DollarSign as PaymentIcon } from 'lucide-react';
import { Customer } from '../data/mockData';
import GenerateScriptButton from '../components/GenerateScriptButton';
import CallOutcomeForm from '../components/CallOutcomeForm';

interface CustomerDetailPageProps {
  customer: Customer;
  onBack: () => void;
}

export default function CustomerDetailPage({ customer, onBack }: CustomerDetailPageProps) {
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const [isCreditLinesOpen, setIsCreditLinesOpen] = useState(false);

  const generateSmartInsights = (customer: Customer) => {
    const insights = [];

    if (customer.history.filter(h => h.status === 'Paid').length >= 2) {
      insights.push({
        icon: TrendingDown,
        text: 'Consistently late but pays eventually. Approach with payment plan options.',
        type: 'behavior'
      });
    }

    if (customer.daysOverdue > 20) {
      insights.push({
        icon: AlertCircle,
        text: 'High priority: Account significantly overdue. Consider escalation if no response.',
        type: 'priority'
      });
    } else if (customer.daysOverdue > 10) {
      insights.push({
        icon: AlertCircle,
        text: 'Moderate urgency: Follow up within 48 hours to prevent further delinquency.',
        type: 'priority'
      });
    }

    insights.push({
      icon: Clock,
      text: 'Best contact time: 2–4 PM weekdays (based on industry data).',
      type: 'timing'
    });

    if (customer.riskLevel === 'High') {
      insights.push({
        icon: PaymentIcon,
        text: 'Recommended: Offer structured payment plan with weekly installments.',
        type: 'strategy'
      });
    } else if (customer.riskLevel === 'Medium') {
      insights.push({
        icon: PaymentIcon,
        text: 'Recommended: Negotiate bi-weekly payment schedule to maintain engagement.',
        type: 'strategy'
      });
    }

    return insights;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-green-700 bg-green-50 border-green-200';
      case 'Missed': return 'text-red-700 bg-red-50 border-red-200';
      case 'Partial': return 'text-orange-700 bg-orange-50 border-orange-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{customer.businessName}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <strong className="text-slate-700">ID:</strong> {customer.customerId}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {customer.contact}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-slate-600 mb-1">Total Overdue</div>
              <div className="text-2xl font-bold text-red-600">${customer.amountDue.toLocaleString()}</div>
              <div className="text-xs font-semibold text-red-600">{customer.daysOverdue} days overdue</div>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-lg border text-sm font-semibold h-fit ${getRiskColor(customer.riskLevel)}`}>
            {customer.riskLevel} Risk
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setIsCreditLinesOpen(!isCreditLinesOpen)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Open Credit Lines</h2>
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                1 overdue
              </span>
            </div>
            {isCreditLinesOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {isCreditLinesOpen && (
            <div className="mt-3 space-y-2">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border-2 border-blue-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{customer.loanProduct}</h3>
                    <p className="text-xs text-slate-600">Loan ID: {customer.loanId} • Primary Overdue Loan</p>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                    OVERDUE
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <div className="text-xs text-slate-600 mb-0.5">Amount Due</div>
                    <div className="text-base font-bold text-slate-900">${customer.amountDue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 mb-0.5">Due Date</div>
                    <div className="text-base font-bold text-slate-900">{customer.dueDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 mb-0.5">Days Overdue</div>
                    <div className="text-base font-bold text-red-600">{customer.daysOverdue} days</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 mb-0.5">Last Payment</div>
                    <div className="text-base font-bold text-slate-900">{customer.lastPaymentDate}</div>
                  </div>
                </div>
              </div>

              {customer.otherActiveLoans.length > 0 && (
                <>
                  {customer.otherActiveLoans.map((loan, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">{loan.product}</h3>
                          <p className="text-xs text-slate-500">Loan ID: {loan.loanId} • Additional Active Loan</p>
                        </div>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded border border-green-200">
                          ACTIVE
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-600">Balance:</span>
                          <span className="font-semibold text-slate-900 ml-1.5">${loan.balance.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Term Remaining:</span>
                          <span className="font-semibold text-slate-900 ml-1.5">{loan.termRemaining}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-slate-600 italic">
                    {customer.otherActiveLoans.length} other active loan{customer.otherActiveLoans.length > 1 ? 's' : ''}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="border-t-2 border-slate-200 pt-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Collection Actions & Call Notes</h2>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/30 p-4 rounded-lg border-2 border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-700" />
                <h3 className="text-base font-semibold text-slate-900">Smart Insights & Recommendations</h3>
              </div>
              <div className="space-y-2">
                {generateSmartInsights(customer).map((insight, index) => (
                  <div key={index} className="flex items-start gap-2 p-2.5 bg-white/60 rounded border border-amber-200/50">
                    <insight.icon className="w-3.5 h-3.5 text-amber-700 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-700 leading-relaxed">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-base font-semibold text-slate-900 mb-3">AI Call Script Generator</h3>
              <GenerateScriptButton customer={customer} />
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Record Call Outcome & Notes</h3>
              <CallOutcomeForm customer={customer} />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <button
            onClick={() => setIsPaymentHistoryOpen(!isPaymentHistoryOpen)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-slate-600" />
              <h2 className="text-base font-bold text-slate-900">Payment History</h2>
              <span className="text-xs text-slate-500">({customer.history.length} payments)</span>
            </div>
            {isPaymentHistoryOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {isPaymentHistoryOpen && (
            <div className="mt-3 space-y-2">
              {customer.history.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">${payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-600">{payment.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
