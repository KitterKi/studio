
'use server';
/**
 * @fileOverview Identifies furniture and decor items in an image and suggests search queries.
 *
 * - findSimilarItems - A function that identifies items in an image.
 * - FindSimilarItemsInput - The input type for the findSimilarItems function.
 * - FindSimilarItemsOutput - The return type for the findSimilarItems function.
 * - IdentifiedItem - The schema for an individual identified item.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindSimilarItemsInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FindSimilarItemsInput = z.infer<typeof FindSimilarItemsInputSchema>;

const IdentifiedItemSchema = z.object({
  itemName: z.string().describe('The common name of the identified item (e.g., "Sofa", "Floor Lamp", "Coffee Table"). Keep it concise, 1-3 words.'),
  itemDescription: z.string().describe('A brief description of the item, highlighting its key visual characteristics relevant for searching (e.g., "Blue velvet 3-seater sofa with gold legs", "Modern arc floor lamp with marble base"). Aim for 5-15 words.'),
  suggestedSearchQuery: z.string().describe('A concise search query for finding this item online, using keywords from the description (e.g., "blue velvet sofa gold legs", "modern arc floor lamp marble base").')
});
export type IdentifiedItem = z.infer<typeof IdentifiedItemSchema>;


const FindSimilarItemsOutputSchema = z.object({
  items: z.array(IdentifiedItemSchema).describe('A list of up to 3-5 prominent furniture or decor items identified in the image.')
});
export type FindSimilarItemsOutput = z.infer<typeof FindSimilarItemsOutputSchema>;

export async function findSimilarItems(input: FindSimilarItemsInput): Promise<FindSimilarItemsOutput> {
  return findSimilarItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSimilarItemsPrompt',
  input: {schema: FindSimilarItemsInputSchema},
  output: {schema: FindSimilarItemsOutputSchema},
  prompt: `You are an expert interior design assistant. Your task is to analyze the provided image of a room and identify up to 3-5 prominent and distinct furniture or decor items.
For each item, provide:
1.  'itemName': A concise common name (e.g., "Armchair", "Wall Art", "Rug").
2.  'itemDescription': A brief visual description highlighting key features useful for searching it online (e.g., "Cream boucle armchair with wooden legs", "Abstract canvas painting with blue and gold tones", "Geometric pattern wool rug").
3.  'suggestedSearchQuery': A practical search query a user might type into an e-commerce site to find that specific item or similar ones.

Focus on items that are clearly visible and central to the room's design. Avoid very small or generic accessories unless they are particularly distinctive.

Image to analyze: {{media url=imageDataUri}}`,
});

const findSimilarItemsFlow = ai.defineFlow(
  {
    name: 'findSimilarItemsFlow',
    inputSchema: FindSimilarItemsInputSchema,
    outputSchema: FindSimilarItemsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.items) {
      // Fallback or error handling if no items are identified or output is malformed
      return { items: [] };
    }
    return output;
  }
);

