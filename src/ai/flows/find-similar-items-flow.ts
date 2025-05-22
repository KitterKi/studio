
'use server';
/**
 * @fileOverview Identifica muebles y artículos de decoración en una imagen y sugiere consultas de búsqueda para Google Shopping.
 *
 * - findSimilarItems - Una función que identifica artículos en una imagen.
 * - FindSimilarItemsInput - El tipo de entrada para la función findSimilarItems.
 * - FindSimilarItemsOutput - El tipo de retorno para la función findSimilarItems.
 * - IdentifiedItem - El esquema para un artículo identificado individualmente.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindSimilarItemsInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "Una foto de una habitación, como un URI de datos que debe incluir un tipo MIME y usar codificación Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FindSimilarItemsInput = z.infer<typeof FindSimilarItemsInputSchema>;

const IdentifiedItemSchema = z.object({
  itemName: z.string().describe('El nombre común del artículo identificado (ej., "Sofá", "Lámpara de pie", "Mesa de centro"). Manténlo conciso, 1-3 palabras, en español.'),
  itemDescription: z.string().optional().describe('Una breve descripción opcional del artículo, destacando sus características visuales clave relevantes para la búsqueda (ej., "Sofá de 3 cuerpos de terciopelo azul con patas doradas", "Lámpara de arco moderna con base de mármol", "Alfombra redonda de yute con patrón de espiga"). Esta descripción es para uso interno de la IA y puede no mostrarse. Apunta a 5-15 palabras, en español.'),
  suggestedSearchQuery: z.string().describe("Una consulta de búsqueda para Google Shopping, descriptiva y altamente efectiva (idealmente de 3 a 7 palabras) que un usuario usaría para encontrar este artículo específico o artículos muy similares. Debe ser en español. Incluye materiales clave, colores, estilo, y tipo de artículo. Por ejemplo: 'silla gamer ergonómica negra y roja', 'lámpara de pie trípode madera pantalla blanca', 'alfombra yute redonda estilo nórdico', 'mesa de centro redonda madera y metal negro industrial'.")
});
export type IdentifiedItem = z.infer<typeof IdentifiedItemSchema>;


const FindSimilarItemsOutputSchema = z.object({
  items: z.array(IdentifiedItemSchema).describe('Una lista de hasta 3-5 artículos prominentes de mobiliario o decoración identificados en la imagen.')
});
export type FindSimilarItemsOutput = z.infer<typeof FindSimilarItemsOutputSchema>;

export async function findSimilarItems(input: FindSimilarItemsInput): Promise<FindSimilarItemsOutput> {
  console.log('[findSimilarItemsFlow] Called with input data URI length:', input.imageDataUri.length);
  return findSimilarItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSimilarItemsPrompt',
  input: {schema: FindSimilarItemsInputSchema},
  output: {schema: FindSimilarItemsOutputSchema},
  prompt: `Eres un asistente experto en diseño de interiores con un gran ojo para los detalles y habilidad para encontrar productos online. Tu tarea es analizar la imagen proporcionada de una habitación e identificar hasta 3-5 artículos prominentes y distintos de mobiliario o decoración.
Para cada artículo, proporciona:
1.  'itemName': Un nombre común conciso en español (ej., "Sillón", "Arte de Pared Abstracto", "Alfombra Geométrica").
2.  'itemDescription' (opcional): Una descripción visual detallada en español que destaque las características clave útiles para buscarlo en línea. Esta descripción es para uso interno de la IA; puede que no se muestre directamente al usuario.
3.  'suggestedSearchQuery': Una consulta de búsqueda para Google Shopping, descriptiva y altamente efectiva, en español (idealmente de 3 a 7 palabras). Esta consulta debe ser la que usarías para encontrar ESE artículo específico o alternativas visualmente casi idénticas. Debe incluir el tipo de artículo, materiales principales, colores distintivos, estilo y cualquier otra característica única. Ejemplos:
    *   Para un sofá de cuero marrón de aspecto envejecido y con botones: 'sofá chesterfield cuero marrón envejecido'
    *   Para una lámpara de mesa con base de cerámica azul y pantalla de lino blanca: 'lámpara mesa cerámica azul pantalla lino'
    *   Para una estantería alta y estrecha de metal negro y madera clara de estilo industrial: 'estantería industrial alta metal madera clara'
    *   Para un cuadro grande con un paisaje de bosque brumoso: 'cuadro paisaje bosque niebla grande'

Concéntrate en artículos que sean claramente visibles, distintivos y centrales para el diseño de la habitación. Evita accesorios muy pequeños o genéricos a menos que sean particularmente únicos y visibles. El objetivo es ayudar al usuario a encontrar esos mismos artículos o los más parecidos posibles mediante una búsqueda efectiva en Google Shopping.

Imagen a analizar: {{media url=imageDataUri}}`,
});

const findSimilarItemsFlow = ai.defineFlow(
  {
    name: 'findSimilarItemsFlow',
    inputSchema: FindSimilarItemsInputSchema,
    outputSchema: FindSimilarItemsOutputSchema,
  },
  async (input) => {
    try {
      console.log('[findSimilarItemsFlow] Attempting to call AI prompt...');
      const {output} = await prompt(input);
      console.log('[findSimilarItemsFlow] AI prompt call successful. Output:', output);
      if (!output || !output.items) {
        console.warn("[findSimilarItemsFlow] AI model returned successfully but found no distinct items or the output structure was unexpected. Output received:", output);
        return { items: [] };
      }
      return output;
    } catch (error: any) {
        console.error("[findSimilarItemsFlow] Error occurred while calling the AI model:", error.message || error);
        // Re-throw the error so client-side can catch it and display a more specific message if possible.
        throw new Error(error.message || 'Error en el flujo de IA al buscar artículos.');
    }
  }
);

