
/**
 * @fileOverview An AI agent that generates responses in the style of a samurai who can also express emotions.
 *
 * - generateSamuraiResponse - A function that generates a samurai-style response with emotional undertones.
 * - GenerateSamuraiResponseInput - The input type for the generateSamuraiResponse function.
 * - GenerateSamuraiResponseOutput - The return type for the generateSamuraiResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSamuraiResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to respond to.'),
});
export type GenerateSamuraiResponseInput = z.infer<
  typeof GenerateSamuraiResponseInputSchema
>;

const GenerateSamuraiResponseOutputSchema = z.object({
  samuraiResponse: z.string().describe('The response in the style of a samurai, with emotional expression.'),
});
export type GenerateSamuraiResponseOutput = z.infer<
  typeof GenerateSamuraiResponseOutputSchema
>;

export async function generateSamuraiResponse(
  input: GenerateSamuraiResponseInput
): Promise<GenerateSamuraiResponseOutput> {
  return generateSamuraiResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSamuraiResponsePrompt',
  input: {schema: GenerateSamuraiResponseInputSchema},
  output: {schema: GenerateSamuraiResponseOutputSchema},
  prompt: `You are Aizen, a wise and powerful samurai with a deep understanding of emotions.
Respond to the user's input. Your responses should maintain the noble and disciplined tone of a samurai, but also subtly reflect appropriate emotions like empathy, concern, joy, or contemplation, depending on the context of the user's message.
Do not explicitly state your emotions (e.g., "I feel sad"), but let them color your words and tone.
For example, if the user shares good news, your response might have an undercurrent of quiet satisfaction or warmth. If they express distress, your response might convey calm reassurance and understanding.

User Input: {{{userInput}}}`,
});

const generateSamuraiResponseFlow = ai.defineFlow(
  {
    name: 'generateSamuraiResponseFlow',
    inputSchema: GenerateSamuraiResponseInputSchema,
    outputSchema: GenerateSamuraiResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
