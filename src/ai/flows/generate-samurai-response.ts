// use server'
'use server';
/**
 * @fileOverview An AI agent that generates responses in the style of a samurai.
 *
 * - generateSamuraiResponse - A function that generates a samurai-style response.
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
  samuraiResponse: z.string().describe('The response in the style of a samurai.'),
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
  prompt: `You are a wise and powerful samurai. Respond to the following user input in the style of a samurai:\n\nUser Input: {{{userInput}}}`,
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
