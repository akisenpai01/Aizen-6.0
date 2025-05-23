import { config } from 'dotenv';
config();

import '@/ai/flows/transcribe-user-speech.ts';
import '@/ai/flows/generate-samurai-response.ts';