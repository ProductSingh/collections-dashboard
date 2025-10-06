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
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
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

  const prompt = `Generate a professional, empathetic debt collection call script based on this customer data: ${JSON.stringify(customerData, null, 2)}

Include:
1. A warm greeting addressing the business name
2. Context about the overdue payment with specific amounts and dates
3. Empathetic acknowledgment of potential business challenges
4. Clear repayment options (full payment, payment plan, partial payment)
5. A professional closing that maintains the relationship

Keep the tone respectful and solution-oriented.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    return `Failed to generate call script: ${error instanceof Error ? error.message : 'Unknown error'}

Fallback Script:
---
Good [morning/afternoon], this is [Your Name] from Bizcap Collections calling for ${customer.businessName}.

I'm reaching out regarding your ${customer.loanProduct} account which has a payment of $${customer.amountDue.toLocaleString()} that was due on ${customer.dueDate}. This payment is now ${customer.daysOverdue} days overdue.

I understand that businesses sometimes face cash flow challenges. I'd like to work with you to find a solution that works for your situation.

We have several options available:
1. Full payment of $${customer.amountDue.toLocaleString()} today
2. A structured payment plan over the next few weeks
3. A partial payment today with a commitment for the balance

What works best for your current situation?

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
