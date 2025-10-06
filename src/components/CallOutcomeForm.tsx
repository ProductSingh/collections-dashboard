import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { Customer } from '../data/mockData';
import { summarizeCallAndSuggestAction } from '../services/geminiService';

interface CallOutcomeFormProps {
  customer: Customer;
}

export default function CallOutcomeForm({ customer }: CallOutcomeFormProps) {
  const [callNotes, setCallNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; nextAction: string } | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!callNotes.trim()) {
      setError('Please enter call notes');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const aiResult = await summarizeCallAndSuggestAction(callNotes, customer);
      setResult(aiResult);
      setCallNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process call notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="callNotes" className="block text-sm font-semibold text-slate-700 mb-2">
            Call Notes
          </label>
          <textarea
            id="callNotes"
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            placeholder="Enter details about the call: customer response, commitments made, payment arrangements discussed..."
            rows={6}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !callNotes.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Call Notes
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="p-6 bg-gradient-to-br from-green-50 to-slate-50 border border-green-200 rounded-lg space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-slate-900">Call Summary & Recommendation</h3>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Summary</h4>
            <p className="text-slate-700 leading-relaxed">{result.summary}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Recommended Next Action</h4>
            <div className="flex items-start gap-2">
              <div className="px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-800 font-semibold">{result.nextAction}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
