import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Customer } from '../data/mockData';
import { generateCallScript } from '../services/geminiService';

interface GenerateScriptButtonProps {
  customer: Customer;
}

export default function GenerateScriptButton({ customer }: GenerateScriptButtonProps) {
  const [script, setScript] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [promiseToPay, setPromiseToPay] = useState<'yes' | 'no' | null>(null);
  const [promiseDate, setPromiseDate] = useState<string>('');
  const [promiseAmount, setPromiseAmount] = useState<string>('');
  const [callCompleted, setCallCompleted] = useState(false);
  
  const isApiConfigured = import.meta.env.VITE_GEMINI_API_KEY && 
    import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here';

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setScript('');

    try {
      const generatedScript = await generateCallScript(customer);
      setScript(generatedScript);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!isApiConfigured && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">
            ⚠️ Gemini API key not configured. AI features will not work in production.
          </p>
        </div>
      )}
      <button
        onClick={handleGenerate}
        disabled={loading || !isApiConfigured}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Script...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate AI Call Script
          </>
        )}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {script && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">AI-Generated Call Script</h3>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-slate-700 font-sans leading-relaxed">
                {script}
              </pre>
            </div>
          </div>

          {/* Call Outcome Tracking */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-slate-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-slate-900">Call Outcome Tracking</h3>
            </div>
            
            {!callCompleted ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Did the customer promise to pay?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPromiseToPay('yes')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        promiseToPay === 'yes'
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-green-50'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Yes
                    </button>
                    <button
                      onClick={() => setPromiseToPay('no')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        promiseToPay === 'no'
                          ? 'bg-red-100 border-red-300 text-red-800'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-red-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      No
                    </button>
                  </div>
                </div>

                {promiseToPay === 'yes' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Promise Date
                      </label>
                      <input
                        type="date"
                        value={promiseDate}
                        onChange={(e) => setPromiseDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Promise Amount ($)
                      </label>
                      <input
                        type="number"
                        value={promiseAmount}
                        onChange={(e) => setPromiseAmount(e.target.value)}
                        placeholder="Enter promised amount"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setCallCompleted(true)}
                  disabled={promiseToPay === null || (promiseToPay === 'yes' && (!promiseDate || !promiseAmount))}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  Complete Call
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Call Completed</span>
                  </div>
                  <div className="text-sm text-green-700">
                    <p><strong>Promise to Pay:</strong> {promiseToPay === 'yes' ? 'Yes' : 'No'}</p>
                    {promiseToPay === 'yes' && (
                      <>
                        <p><strong>Promise Date:</strong> {promiseDate}</p>
                        <p><strong>Promise Amount:</strong> ${promiseAmount}</p>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCallCompleted(false);
                    setPromiseToPay(null);
                    setPromiseDate('');
                    setPromiseAmount('');
                  }}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 underline"
                >
                  Reset for new call
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
