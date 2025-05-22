
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
  // itemDescription es opcional y no se muestra en la UI, pero puede ayudar a la IA a generar la consulta.
  itemDescription: z.string().optional().describe('Una breve descripción opcional del artículo, destacando sus características visuales clave relevantes para la búsqueda (ej., "Sofá de 3 cuerpos de terciopelo azul con patas doradas", "Lámpara de arco moderna con base de mármol", "Alfombra redonda de yute con patrón de espiga"). Esta descripción es para uso interno de la IA y puede no mostrarse. Apunta a 5-15 palabras, en español.'),
  suggestedSearchQuery: z.string().describe("Una consulta de búsqueda para Google Shopping, descriptiva y altamente efectiva (idealmente de 3 a 7 palabras) que un usuario usaría para encontrar este artículo específico o artículos muy similares. Debe ser en español. Incluye materiales clave, colores, estilo, y tipo de artículo. Por ejemplo: 'silla gamer ergonómica negra y roja', 'lámpara de pie trípode madera pantalla blanca', 'alfombra yute redonda estilo nórdico', 'mesa de centro redonda madera y metal negro industrial'.")
});
export type IdentifiedItem = z.infer<typeof IdentifiedItemSchema>;


const FindSimilarItemsOutputSchema = z.object({
  items: z.array(IdentifiedItemSchema).describe('Una lista de hasta 3-5 artículos prominentes de mobiliario o decoración identificados en la imagen.')
});
export type FindSimilarItemsOutput = z.infer<typeof FindSimilarItemsOutputSchema>;

export async function findSimilarItems(input: FindSimilarItemsInput): Promise<FindSimilarItemsOutput> {
  console.log('[findSimilarItems function wrapper] Called with input data URI length:', input.imageDataUri?.length);
  try {
    const result = await findSimilarItemsFlow(input); // Call the actual flow
    return result;
  } catch (error: any) {
    console.error("[findSimilarItems function wrapper] Error calling findSimilarItemsFlow:", error);
    // Re-throw to be caught by the client-side component's catch block.
    // Ensure a meaningful message is propagated.
    throw new Error(error.message || 'Error al procesar la solicitud de búsqueda de artículos.');
  }
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
      const {output} = await prompt(input); // This is the call to the AI model
      console.log('[findSimilarItemsFlow] AI prompt call successful. Output items count:', output?.items?.length);

      if (!output || !output.items) {
        console.warn("[findSimilarItemsFlow] AI model returned successfully but found no distinct items or the output structure was unexpected. Output received:", JSON.stringify(output, null, 2));
        // No lanzar error aquí, simplemente devolver items vacíos si la IA no encuentra nada.
        return { items: [] };
      }
      return output;
    } catch (error: any) {
        console.error("-----------------------------------------------------");
        console.error("[findSimilarItemsFlow - AI Call Error] An error occurred inside the AI flow.");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        if (error.cause) {
            console.error("Error Cause:", error.cause);
        }
        if (error.details) { // Specific to GoogleGenerativeAIError
             console.error("Error Details (from Google AI):", error.details);
        }
        console.error("Full Error Object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        console.error("-----------------------------------------------------");

        let errorMessage = 'Error en el flujo de IA al buscar artículos.';
        if (error.message) {
            // Simplificar mensaje de error para el cliente
            if (String(error.message).includes("fetch") || String(error.message).includes("502") || String(error.message).includes("503") || String(error.message).toLowerCase().includes("overloaded") || String(error.message).toLowerCase().includes("unavailable")) {
                errorMessage = "El servicio de IA no está disponible o está experimentando problemas. Por favor, inténtalo de nuevo más tarde.";
            } else if (String(error.message).toLowerCase().includes("api key") || String(error.message).includes("401") || String(error.message).includes("403")) {
                errorMessage = "Error de autenticación con el servicio de IA. Verifica la configuración.";
            } else {
                errorMessage = "Ocurrió un error inesperado al procesar tu solicitud."; // Mensaje genérico para otros errores
            }
        }
        // Re-throw a new error with a potentially more user-friendly message
        // The client-side toast will pick up this message.
        throw new Error(errorMessage);
    }
  }
);

