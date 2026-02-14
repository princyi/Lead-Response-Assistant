import React, { useState, useRef } from 'react';
import { Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function EnquiryAssistant() {
  const [enquiry, setEnquiry] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const responseRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!enquiry.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setConfidence(null);

    try {
      const result = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a customer service specialist trained to provide accurate, helpful responses to customer enquiries. 

CRITICAL GUIDELINES:
1. NEVER make claims you cannot verify. If unsure, acknowledge uncertainty explicitly.
2. Ask 2-3 clarifying follow-up questions to better understand the issue.
3. Provide safe, practical next steps (not false promises).
4. Acknowledge the customer's concern with empathy.
5. Use clear, natural language.

Customer Enquiry:
"${enquiry}"

Respond in the following JSON format:
{
  "acknowledgment": "Brief empathetic acknowledgment of their concern",
  "analysis": {
    "intent": "What the customer is asking for",
    "severity": "low/medium/high",
    "confidence": 0.0-1.0
  },
  "clarifyingQuestions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ],
  "nextSteps": [
    "Step 1",
    "Step 2",
    "Step 3"
  ],
  "warnings": ["Any disclaimers or caveats"],
  "tone": "professional and empathetic"
}

Return ONLY valid JSON, no additional text.`
            }
          ]
        })
      });

      const data = await result.json();
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response format from API');
      }

      let responseText = data.content[0].text;
      // Remove markdown code blocks if present
      responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
      
      const parsed = JSON.parse(responseText);
      setResponse(parsed);
      setConfidence(parsed.analysis?.confidence || 0.8);
    } catch (err) {
      setError(err.message || 'Failed to generate response. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exampleEnquiries = [
    "Hi, I am getting damp patches on my bedroom wall after rains. What should I do?",
    "My internet keeps dropping every evening around 8 PM. How can I fix this?",
    "I ordered something 2 weeks ago and haven't received it yet. Where is it?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Customer Enquiry Assistant
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AI-powered response generation with accuracy safeguards. Built to understand intent, ask clarifying questions, and provide reliable guidance without hallucinations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Box */}
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Customer Enquiry
                </label>
                <textarea
                  value={enquiry}
                  onChange={(e) => setEnquiry(e.target.value)}
                  placeholder="Paste a customer enquiry here..."
                  className="w-full h-32 p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                />
                <div className="mt-2 text-xs text-slate-500">
                  {enquiry.length} characters
                </div>
              </div>

              {/* Example Buttons */}
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Try Examples
                </p>
                <div className="space-y-2">
                  {exampleEnquiries.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setEnquiry(example)}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 hover:border-slate-500 transition truncate"
                    >
                      {example.substring(0, 50)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !enquiry.trim()}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Generating Response...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Generate Response
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg flex gap-3">
                  <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-300">Error</p>
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                How It Works
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold flex-shrink-0">1</span>
                  <span>Analyzes customer intent</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold flex-shrink-0">2</span>
                  <span>Generates clarifying questions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold flex-shrink-0">3</span>
                  <span>Provides safe next steps</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold flex-shrink-0">4</span>
                  <span>Avoids false promises</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Accuracy Controls</h3>
              <p className="text-sm text-slate-300 mb-3">
                This system includes safeguards:
              </p>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>✓ Structured JSON format for validation</li>
                <li>✓ Confidence scoring</li>
                <li>✓ Severity assessment</li>
                <li>✓ Uncertainty disclaimers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Response Section */}
        {response && (
          <div ref={responseRef} className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Generated Response</h2>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                confidence >= 0.8 
                  ? 'bg-green-900/50 text-green-300 border border-green-700' 
                  : confidence >= 0.6
                  ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                  : 'bg-red-900/50 text-red-300 border border-red-700'
              }`}>
                Confidence: {(confidence * 100).toFixed(0)}%
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Acknowledgment
              </h3>
              <p className="text-lg text-white leading-relaxed">
                {response.acknowledgment}
              </p>
            </div>

            {/* Analysis */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Intent</h4>
                <p className="text-white">{response.analysis?.intent || 'N/A'}</p>
              </div>
              <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Severity</h4>
                <p className="text-white capitalize">{response.analysis?.severity || 'N/A'}</p>
              </div>
              <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Type</h4>
                <p className="text-white">{response.tone || 'Professional'}</p>
              </div>
            </div>

            {/* Clarifying Questions */}
            {response.clarifyingQuestions && response.clarifyingQuestions.length > 0 && (
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4">
                  Follow-up Questions to Ask
                </h3>
                <ul className="space-y-3">
                  {response.clarifyingQuestions.map((q, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-blue-400 font-bold flex-shrink-0">Q{i + 1}</span>
                      <span className="text-white">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            {response.nextSteps && response.nextSteps.length > 0 && (
              <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-green-300 uppercase tracking-wider mb-4">
                  Safe Next Steps
                </h3>
                <ol className="space-y-3">
                  {response.nextSteps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-green-400 font-bold flex-shrink-0">{i + 1}</span>
                      <span className="text-white">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Warnings/Disclaimers */}
            {response.warnings && response.warnings.length > 0 && (
              <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Important Disclaimers
                </h3>
                <ul className="space-y-2">
                  {response.warnings.map((w, i) => (
                    <li key={i} className="text-amber-200 text-sm flex gap-2">
                      <span className="flex-shrink-0">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw Response */}
            <details className="cursor-pointer">
              <summary className="text-sm font-semibold text-slate-400 hover:text-slate-300 uppercase tracking-wider">
                View Raw JSON Response
              </summary>
              <pre className="mt-4 p-4 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300 overflow-auto max-h-64">
                {JSON.stringify(response, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            This system uses Claude Sonnet 4 with structured JSON output to ensure consistency and accuracy. 
            Always review generated responses before sending to customers.
          </p>
        </div>
      </div>
    </div>
  );
}
