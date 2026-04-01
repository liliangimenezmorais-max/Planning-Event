'use server';
/**
 * @fileOverview An AI assistant for event professionals to draft initial client responses and suggest quote details.
 *
 * - aiResponseAssistantForPros - A function that assists professionals in drafting responses and quotes.
 * - AiResponseAssistantForProsInput - The input type for the aiResponseAssistantForPros function.
 * - AiResponseAssistantForProsOutput - The return type for the aiResponseAssistantForPros function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiResponseAssistantForProsInputSchema = z.object({
  clientRequest: z
    .object({
      date: z.string().describe('The date of the event in YYYY-MM-DD format.'),
      location: z
        .string()
        .describe('The location of the event (city, state/region).'),
      eventType: z
        .string()
        .describe(
          'The type of event (e.g., Mariage, Anniversaire, EVJF / EVJG, Baptême, Soirée entreprise).'
        ),
      budget: z
        .number()
        .describe(
          'The client\'s stated budget for the event or specific service.'
        ),
      desiredProfessional: z
        .string()
        .describe(
          'The type of professional the client is looking for (e.g., DJ, Traiteur, Photographe, Wedding planner).'
        ),
      description: z
        .string()
        .optional()
        .describe(
          'Any additional description provided by the client about their event or needs.'
        ),
    })
    .describe('Details of the client\'s event request.'),
  professionalServices: z
    .object({
      serviceCategories: z
        .array(z.string())
        .describe(
          'List of service categories offered by the professional (e.g., "DJ services", "Catering - Buffet", "Photography - Wedding Package").'
        ),
      pricingStructure: z
        .string()
        .describe(
          'General description of the professional\'s pricing structure (e.g., "hourly rates starting at X", "package deals available", "custom quotes").'
        ),
      availabilityStatus: z
        .string()
        .describe(
          'Professional\'s availability status for the requested date (e.g., "available", "tentatively available", "not available").'
        ),
      portfolioHighlights: z
        .array(z.string())
        .optional()
        .describe(
          'Key highlights or types of past projects relevant to the requested event type.'
        ),
    })
    .describe('Details about the professional\'s service offerings.'),
});
export type AiResponseAssistantForProsInput = z.infer<
  typeof AiResponseAssistantForProsInputSchema
>;

const AiResponseAssistantForProsOutputSchema = z.object({
  draftResponse: z
    .string()
    .describe(
      'A personalized initial response draft for the client, acknowledging their request and offering further engagement.'
    ),
  suggestedQuoteDetails: z
    .array(z.string())
    .describe(
      'A list of key details or sections to include in the quote template, specific to the client\'s request and professional\'s services (e.g., "Base package for [event type]", "Add-on: Lighting package", "Travel fees for [location]").'
    ),
});
export type AiResponseAssistantForProsOutput = z.infer<
  typeof AiResponseAssistantForProsOutputSchema
>;

export async function aiResponseAssistantForPros(
  input: AiResponseAssistantForProsInput
): Promise<AiResponseAssistantForProsOutput> {
  return aiResponseAssistantForProsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiResponseAssistantForProsPrompt',
  input: {schema: AiResponseAssistantForProsInputSchema},
  output: {schema: AiResponseAssistantForProsOutputSchema},
  prompt: `You are an AI assistant helping an event professional ({{clientRequest.desiredProfessional}}) to respond to a new client request and prepare a quote. The professional offers the following services: {{{professionalServices.serviceCategories}}}.
Their pricing structure is: {{{professionalServices.pricingStructure}}}.
Their availability for the requested date is: {{{professionalServices.availabilityStatus}}}.

Here is the client's event request:
- Date: {{{clientRequest.date}}}
- Location: {{{clientRequest.location}}}
- Event Type: {{{clientRequest.eventType}}}
- Budget: {{{clientRequest.budget}}}
- Professional Requested: {{{clientRequest.desiredProfessional}}}
{{#if clientRequest.description}}- Description: {{{clientRequest.description}}}{{/if}}

Given this information, perform two tasks:

1.  **Draft a personalized initial response** to the client. This response should:
    - Acknowledge their request.
    - Confirm understanding of their event type and date.
    - Briefly mention your availability or next steps if unavailable.
    - Express enthusiasm for their event.
    - Propose a next step (e.g., a brief call, sending a detailed quote).

2.  **Suggest key details or sections for a quote template** specific to this client's request and your service offerings. Think about typical items for a quote in this industry, tailored to the client's budget and event type. Include items like base packages, potential add-ons, travel fees, or special considerations.

Keep both outputs professional and concise.

Professional's portfolio highlights (if any): {{#if professionalServices.portfolioHighlights}} {{professionalServices.portfolioHighlights}}{{else}}None provided.{{/if}}`,
});

const aiResponseAssistantForProsFlow = ai.defineFlow(
  {
    name: 'aiResponseAssistantForProsFlow',
    inputSchema: AiResponseAssistantForProsInputSchema,
    outputSchema: AiResponseAssistantForProsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);