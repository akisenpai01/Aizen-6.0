import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Load environment variables
import { config } from 'dotenv';
config({ path: `.env.local`, override: true }); // Ensure .env.local is loaded

if (!process.env.GOOGLE_API_KEY) {
  console.warn(
    '\n\n⚠️  GOOGLE_API_KEY environment variable not set.\n' +
    'You can get one from the Google AI Studio:\n' +
    '➡️  https://aistudio.google.com/app/apikey' +
    '\n\nSet the GOOGLE_API_KEY environment variable in the .env.local file.\n\n'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY, // Use API key from environment variable
    }),
  ],
  // Default model, can be overridden in specific prompts/flows
  model: 'googleai/gemini-2.0-flash', 
  // Log level can be set here if needed, e.g., logLevel: 'debug'
});
