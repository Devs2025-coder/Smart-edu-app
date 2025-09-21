'use server';

/**
 * @fileOverview AI-powered personalized task suggestion flow for students.
 *
 * - getPersonalizedTaskSuggestions - A function that suggests personalized tasks based on student performance and curriculum progress.
 * - PersonalizedTaskSuggestionsInput - The input type for the getPersonalizedTaskSuggestions function.
 * - PersonalizedTaskSuggestionsOutput - The return type for the getPersonalizedTaskSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedTaskSuggestionsInputSchema = z.object({
  studentProfile: z
    .string()
    .describe("A description of the student's profile, including their strengths, weaknesses, and learning style."),
  curriculumProgress: z
    .string()
    .describe('A description of the student curriculum progress'),
  recentActivities: z
    .string()
    .describe('A list of recent activities and performance of the student'),
});
export type PersonalizedTaskSuggestionsInput = z.infer<
  typeof PersonalizedTaskSuggestionsInputSchema
>;

const PersonalizedTaskSuggestionsOutputSchema = z.object({
  taskSuggestions: z
    .string()
    .describe('A list of personalized task suggestions for the student.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the task suggestions.'),
});

export type PersonalizedTaskSuggestionsOutput = z.infer<
  typeof PersonalizedTaskSuggestionsOutputSchema
>;

export async function getPersonalizedTaskSuggestions(
  input: PersonalizedTaskSuggestionsInput
): Promise<PersonalizedTaskSuggestionsOutput> {
  return personalizedTaskSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedTaskSuggestionsPrompt',
  input: {schema: PersonalizedTaskSuggestionsInputSchema},
  output: {schema: PersonalizedTaskSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized task suggestions to students based on their performance and curriculum progress.

  Analyze the following information about the student:

  Student Profile: {{{studentProfile}}}
  Curriculum Progress: {{{curriculumProgress}}}
  Recent Activities: {{{recentActivities}}}

  Based on this information, suggest a list of personalized tasks that will help the student improve their learning experience. Explain the reasoning behind each task suggestion.

  Output the task suggestions and reasoning in a structured format.
  `,
});

const personalizedTaskSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedTaskSuggestionsFlow',
    inputSchema: PersonalizedTaskSuggestionsInputSchema,
    outputSchema: PersonalizedTaskSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
