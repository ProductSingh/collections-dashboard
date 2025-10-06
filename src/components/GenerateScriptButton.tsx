import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Customer } from '../data/mockData';
import { generateCallScript } from '../services/geminiService';

interface GenerateScriptButtonProps {
  customer: Customer;
}

export default function GenerateScriptButton({ customer }: GenerateScriptButtonProps) {
  const [script, setScript] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
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
      )}
    </div>
  );
}
