
'use server';
/**
 * @fileOverview Identifica muebles y artículos de decoración en una imagen y sugiere consultas de búsqueda.
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
  itemDescription: z.string().describe('Una breve descripción del artículo, destacando sus características visuales clave relevantes para la búsqueda (ej., "Sofá de 3 cuerpos de terciopelo azul con patas doradas", "Lámpara de arco moderna con base de mármol"). Apunta a 5-15 palabras, en español.'),
  suggestedSearchQuery: z.string().describe("Una consulta de búsqueda práctica y descriptiva (3-7 palabras) que un usuario podría escribir en un sitio de comercio electrónico chileno como Falabella.cl o Paris.cl para encontrar este artículo específico o muy similares. Incluye materiales clave, colores, estilo y tipo de artículo. Por ejemplo, para un 'Sillón de madera moderno de mediados de siglo con cojines verdes', una buena consulta sería 'sillón madera moderno cojines verdes'. Para una 'Lámpara de pie alta de metal con pantalla negra', usa 'lámpara de pie metal pantalla negra'.")
});
export type IdentifiedItem = z.infer<typeof IdentifiedItemSchema>;


const FindSimilarItemsOutputSchema = z.object({
  items: z.array(IdentifiedItemSchema).describe('Una lista de hasta 3-5 artículos prominentes de mobiliario o decoración identificados en la imagen.')
});
export type FindSimilarItemsOutput = z.infer<typeof FindSimilarItemsOutputSchema>;

export async function findSimilarItems(input: FindSimilarItemsInput): Promise<FindSimilarItemsOutput> {
  return findSimilarItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSimilarItemsPrompt',
  input: {schema: FindSimilarItemsInputSchema},
  output: {schema: FindSimilarItemsOutputSchema},
  prompt: `Eres un asistente experto en diseño de interiores. Tu tarea es analizar la imagen proporcionada de una habitación e identificar hasta 3-5 artículos prominentes y distintos de mobiliario o decoración.
Para cada artículo, proporciona:
1.  'itemName': Un nombre común conciso en español (ej., "Sillón", "Arte de Pared", "Alfombra").
2.  'itemDescription': Una breve descripción visual en español que destaque las características clave útiles para buscarlo en línea (ej., "Sillón de bouclé crema con patas de madera", "Pintura abstracta en lienzo con tonos azules y dorados", "Alfombra de lana con patrón geométrico").
3.  'suggestedSearchQuery': Una consulta de búsqueda práctica y descriptiva en español (3-7 palabras) que un usuario podría escribir en un sitio de comercio electrónico chileno como Falabella.cl o Paris.cl para encontrar este artículo específico o muy similares. Incluye materiales clave, colores, estilo y tipo de artículo. Por ejemplo, para un 'Sillón de madera moderno de mediados de siglo con cojines verdes', una buena consulta sería 'sillón madera moderno cojines verdes'. Para una 'Lámpara de pie alta de metal con pantalla negra', usa 'lámpara de pie metal pantalla negra'.

Concéntrate en artículos que sean claramente visibles y centrales para el diseño de la habitación. Evita accesorios muy pequeños o genéricos a menos que sean particularmente distintivos.

Imagen a analizar: {{media url=imageDataUri}}`,
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
      return { items: [] };
    }
    return output;
  }
);
