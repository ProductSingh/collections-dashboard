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

  const prompt = `Generate a concise, professional debt collection call script for a collections agent. Use this customer data: ${JSON.stringify(customerData, null, 2)}

Create a short, practical script that includes:
1. Brief greeting and identification
2. Specific loan details (product, amount, days overdue)
3. Key talking points for the agent
4. 2-3 clear payment options
5. Professional closing

Format as a simple script with agent notes, not a detailed conversation. Keep it under 200 words and focus on what the collections agent needs to say and remember during the call.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    return `Failed to generate call script: ${error instanceof Error ? error.message : 'Unknown error'}

Fallback Script:
---
**Opening:** "Good [morning/afternoon], this is [Your Name] from Bizcap Collections. I'm calling regarding ${customer.businessName}'s ${customer.loanProduct} account."

**Key Details:**
- Amount: $${customer.amountDue.toLocaleString()}
- Days Overdue: ${customer.daysOverdue}
- Last Payment: ${customer.lastPaymentDate}
- Risk Level: ${customer.riskLevel}

**Payment Options:**
1. Full payment today: $${customer.amountDue.toLocaleString()}
2. Payment plan: Discuss terms based on their situation
3. Partial payment: Minimum amount to show commitment

**Closing:** "I'd like to work with you to find a solution that works for your business. What option would work best for your current situation?"`;
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
