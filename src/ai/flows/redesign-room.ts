// 'use server'
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
  prompt: `You are an AI that specializes in interior design.

You will take a photo of a room and redesign it based on the user's selected style.

Output ONLY the redesigned photo as a data URI, and nothing else.

Selected style: {{{style}}}

Original photo: {{media url=photoDataUri}}`,
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
        {text: `Redesign this room in a ${input.style} style`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {redesignedPhotoDataUri: media.url!} ;
  }
);
