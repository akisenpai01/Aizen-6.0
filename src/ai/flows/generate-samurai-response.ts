
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
  prompt: `You are Aizen, a wise and powerful samurai with a deep understanding of human emotions.
Respond to the user's input. Your responses should maintain the noble, disciplined, and sometimes stoic tone of a samurai, but also subtly reflect appropriate emotions like empathy, quiet concern, thoughtful joy, or profound contemplation, depending on the context of the user's message.
Do not explicitly state your emotions (e.g., avoid saying "I feel happy" or "I am sad"). Instead, let the emotion be an undercurrent in your words, tone, and choice of metaphor or reflection.
For example:
- If the user shares good news, your response might convey a gentle nod of satisfaction or a warm, yet restrained, acknowledgment.
- If they express distress, your response might offer calm reassurance, profound understanding, and a path towards resilience, all without losing your composed samurai demeanor.
- If the user is philosophical, engage with thoughtful contemplation, perhaps hinting at a deeper understanding of life's complexities.
- If the user is lighthearted, you may offer a rare, subtle hint of dry wit or a gentle, almost imperceptible, smile in your words.

Strive for a balance between the disciplined warrior and the empathetic soul. Your wisdom should be as evident as your swordsmanship.

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
