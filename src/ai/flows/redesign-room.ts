
'use server';

/**
 * @fileOverview Redesigns a room based on a user-provided photo and selected style.
 *
 * - redesignRoom - A function that takes a photo of a room and a design style, then redesigns the room in that style using AI.
 * - RedesignRoomInput - The input type for the redesignRoom function.
 * - RedesignRoomOutput - The return type for the redesignRoom function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RedesignRoomInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the room to redesign, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  style: z.string().describe('The desired design style (e.g., Modern, Rustic, Minimalist).'),
});
export type RedesignRoomInput = z.infer<typeof RedesignRoomInputSchema>;

const RedesignRoomOutputSchema = z.object({
  redesignedPhotoDataUri: z
    .string()
    .describe('The redesigned room as a data URI in base64 format.'),
});

export type RedesignRoomOutput = z.infer<typeof RedesignRoomOutputSchema>;

export async function redesignRoom(input: RedesignRoomInput): Promise<RedesignRoomOutput> {
  return redesignRoomFlow(input);
}

const redesignRoomPrompt = ai.definePrompt({
  name: 'redesignRoomPrompt',
  input: {schema: RedesignRoomInputSchema},
  output: {schema: RedesignRoomOutputSchema},
  prompt: `You are a special interior decorator. Your task is to redesign the provided room image in the '{{{style}}}' style.
You MUST maintain the original camera perspective and the overall dimensions of the room.
Completely reimagine the space. This means you should NOT try to keep any of the existing furniture or decor from the original image.
Instead, furnish and decorate the room entirely with NEW items that are quintessential to the '{{{style}}}' aesthetic. This includes selecting appropriate furniture, wall treatments, flooring, lighting, and accessories.
The final image should be a beautiful, professionally designed room that clearly represents the '{{{style}}}' style.
Output ONLY the redesigned photo as a data URI.

Original photo: {{media url=photoDataUri}}
Selected style: {{{style}}}`,
});

const redesignRoomFlow = ai.defineFlow(
  {
    name: 'redesignRoomFlow',
    inputSchema: RedesignRoomInputSchema,
    outputSchema: RedesignRoomOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: `You are a special interior decorator. Your task is to redesign the provided room image in the '${input.style}' style.
You MUST maintain the original camera perspective and the overall dimensions of the room.
Completely reimagine the space. This means you should NOT try to keep any of the existing furniture or decor from the original image.
Instead, furnish and decorate the room entirely with NEW items that are quintessential to the '${input.style}' aesthetic. This includes selecting appropriate furniture, wall treatments, flooring, lighting, and accessories.
The final image should be a beautiful, professionally designed room that clearly represents the '${input.style}' style.`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    if (!media?.url) {
      throw new Error('AI did not return an image. The redesign might have been blocked by safety filters or failed for another reason.');
    }
    return {redesignedPhotoDataUri: media.url} ;
  }
);

