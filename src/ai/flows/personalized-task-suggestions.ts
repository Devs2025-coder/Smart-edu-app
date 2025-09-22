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
  interestBasedSuggestions: z.object({
    suggestions: z
      .string()
      .describe(
        'A list of personalized task suggestions for the student based on their interests and career goals.'
      ),
    reasoning: z
      .string()
      .describe('The reasoning behind the interest-based task suggestions.'),
  }),
  weaknessBasedSuggestions: z.object({
    suggestions: z
      .string()
      .describe(
        'A list of personalized task suggestions for the student based on their weaknesses.'
      ),
    reasoning: z
      .string()
      .describe('The reasoning behind the weakness-based task suggestions.'),
  }),
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
  prompt: `You are an AI assistant designed to provide personalized task suggestions to students.

  Analyze the following information about the student:
  Student Profile: {{{studentProfile}}}
  Curriculum Progress: {{{curriculumProgress}}}
  Recent Activities: {{{recentActivities}}}

  Based on this information, generate two distinct sets of personalized tasks:
  1. Interest-Based Suggestions: Create tasks that align with the student's interests and career goals to foster passion and motivation.
  2. Weakness-Based Suggestions: Create tasks that directly address the student's areas of weakness to help them improve academically.

  For each set of suggestions, provide a clear reasoning for why these tasks are recommended.

  Output the suggestions and reasoning in the structured format defined in the output schema.
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
