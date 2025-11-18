
import { GoogleGenAI } from "@google/genai";
import { Transaction, Contact } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateFinancialSummary = async (transactions: Transaction[], contacts: Contact[]): Promise<string> => {
  if (!API_KEY) {
    return "Gemini AI is not configured. Please set the API_KEY environment variable.";
  }

  const model = "gemini-2.5-flash";
  
  const transactionsData = transactions.map(t => {
    const contactName = contacts.find(c => c.id === t.contactId)?.name || 'Unknown';
    return `- ${t.date.substring(0,10)}: ${t.type} of ${t.amount} with ${contactName}. Notes: ${t.notes || 'N/A'}`;
  }).join('\n');

  const contactsData = contacts.map(c => `- ${c.name} (${c.type}): Current Balance ${c.balance}`).join('\n');

  const prompt = `
    Analyze the following financial data from a digital ledger application and provide a concise, insightful summary.
    The summary should be easy to understand for a small business owner.
    Do not just list the data. Provide analysis and actionable suggestions.
    Format your response in Markdown.

    **Contacts Summary:**
    ${contactsData}

    **Recent Transactions:**
    ${transactionsData}

    Based on this data, provide:
    1.  A brief overview of the current financial health.
    2.  Identify any notable trends (e.g., high spending, significant income).
    3.  Suggest one or two actionable steps the user could take to improve their financial situation (e.g., follow up on outstanding balances, review supplier costs).
    `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating financial summary:", error);
    return "Sorry, I couldn't generate a summary at this time. Please check your API key and network connection.";
  }
};
