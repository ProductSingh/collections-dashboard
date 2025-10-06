import { Customer } from '../data/mockData';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

let lastCallTime = 0;
const DEBOUNCE_DELAY = 1000;

async function callGeminiAPI(prompt: string): Promise<string> {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;

  if (timeSinceLastCall < DEBOUNCE_DELAY) {
    await new Promise(resolve => setTimeout(resolve, DEBOUNCE_DELAY - timeSinceLastCall));
  }

  lastCallTime = Date.now();

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error('Gemini API Key Status:', {
      hasKey: !!GEMINI_API_KEY,
      keyValue: GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'undefined',
      isDefault: GEMINI_API_KEY === 'your_gemini_api_key_here'
    });
    throw new Error('Gemini API key not configured. Please configure VITE_GEMINI_API_KEY in your environment variables.');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

export async function generateCallScript(customer: Customer): Promise<string> {
  const customerData = {
    businessName: customer.businessName,
    contact: customer.contact,
    loanProduct: customer.loanProduct,
    amountDue: customer.amountDue,
    daysOverdue: customer.daysOverdue,
    riskLevel: customer.riskLevel,
    lastPaymentDate: customer.lastPaymentDate,
    otherActiveLoans: customer.otherActiveLoans
  };

  const prompt = `Generate a clean, professional debt collection call script for a collections agent. Use this customer data: ${JSON.stringify(customerData, null, 2)}

Create a practical script that includes:
1. Brief greeting and identification
2. Specific loan details (product, amount, days overdue)
3. Key talking points for the agent
4. 2-3 clear payment options
5. Promise to pay commitment and follow-up
6. Professional closing

CRITICAL FORMATTING REQUIREMENTS:
- NO markdown formatting (no **, [], *, etc.)
- NO placeholders like [Agent Name], [Contact Person], [Company Name]
- NO brackets or parentheses for instructions
- Write as plain text conversation
- Use actual values from customer data
- Write as if speaking directly to the customer
- Keep it under 200 words and conversational
- Include specific language about payment commitments and follow-up dates
- Format as a simple conversation, not a script with notes

EXAMPLE FORMAT:
Good morning, this is calling from Bizcap Collections regarding TechStart Solutions' Business Cash Advance account. I need to discuss your outstanding balance of $18,900 which is now 26 days overdue. Your last payment was received on June 20th. I understand that running a business can be challenging, and I'd like to work with you to find a solution. We have a few options available: full payment today, a structured payment plan, or a partial payment with a commitment for the balance. Can you commit to making a payment by a specific date? I'll follow up with you on that date to confirm receipt. Thank you for your time.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    return `Failed to generate call script: ${error instanceof Error ? error.message : 'Unknown error'}

Fallback Script:

Good morning, this is calling from Bizcap Collections regarding ${customer.businessName}'s ${customer.loanProduct} account.

I need to discuss your outstanding balance of $${customer.amountDue.toLocaleString()} which is now ${customer.daysOverdue} days overdue. Your last payment was received on ${customer.lastPaymentDate}.

I understand that running a business can be challenging, and I'd like to work with you to find a solution that works for your situation.

We have a few options available:
1. Full payment of $${customer.amountDue.toLocaleString()} today
2. A structured payment plan over the next few weeks
3. A partial payment today with a commitment for the balance

I need to get a commitment from you today. Can you commit to making a payment by a specific date? If so, what date can you commit to and what amount?

I'll note this commitment in our system and follow up with you on that date. If you can't make the payment as promised, please call me before that date so we can discuss alternatives.

Thank you for your time, and I look forward to resolving this together.`;
  }
}

export async function summarizeCallAndSuggestAction(callNotes: string, customer: Customer): Promise<{ summary: string; nextAction: string }> {
  const prompt = `Based on this call note from a debt collection call for ${customer.businessName} (Amount Due: $${customer.amountDue}, Days Overdue: ${customer.daysOverdue}):

"${callNotes}"

Provide:
1. A two-sentence summary of the call
2. A specific next follow-up action (e.g., "Follow-up in 3 days", "Offer payment plan", "Escalate to management", "Schedule callback on [date]", "Send payment link", etc.)

Format your response as:
SUMMARY: [your summary]
NEXT ACTION: [your recommended action]`;

  try {
    const response = await callGeminiAPI(prompt);

    const summaryMatch = response.match(/SUMMARY:\s*(.+?)(?=NEXT ACTION:|$)/s);
    const actionMatch = response.match(/NEXT ACTION:\s*(.+?)$/s);

    return {
      summary: summaryMatch ? summaryMatch[1].trim() : response.substring(0, 200),
      nextAction: actionMatch ? actionMatch[1].trim() : 'Follow-up in 3 days'
    };
  } catch (error) {
    return {
      summary: `Call completed with ${customer.businessName}. Unable to generate AI summary.`,
      nextAction: 'Follow-up in 3 days'
    };
  }
}
