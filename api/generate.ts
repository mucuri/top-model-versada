// IMPORTANT: This file should be placed in the `api` directory at the root of your project.
// It acts as a secure backend function that runs on a server (like Vercel), not in the browser.
// This protects your API key.

import { GoogleGenAI, Modality } from "@google/genai";
import { APP_NAME } from '../constants'; // Import APP_NAME

// This is a Vercel Edge Function, which uses a standard Request/Response API.
// In many environments, you might need to export a handler function differently.
// For Vercel, creating a file in the /api folder is enough.
// The types for Request and Response are globally available in these environments.

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { base64Image, stylePrompt } = await req.json();

    if (!base64Image || !stylePrompt) {
      return new Response(JSON.stringify({ error: 'Missing base64Image or stylePrompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
       return new Response(JSON.stringify({ error: 'API key not configured on the server.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const getMimeType = (base64: string): string => {
        const match = base64.match(/^data:(image\/[a-z]+);base64,/);
        return match ? match[1] : 'image/jpeg'; // fallback
    }

    const base64Data = base64Image.split(',')[1];
    const mimeType = getMimeType(base64Image);

    const prompt = `**CRITICAL OUTPUT RULES - FOLLOW THESE EXACTLY:**
1.  **Final Image Format:** Generate a SINGLE, unified, vertical image.
2.  **Aspect Ratio:** The aspect ratio MUST be exactly 9:16. NOT 1:1, NOT 16:9. It must be vertical like a phone screen.
3.  **Content - Poses:** The image MUST contain exactly SIX (6) distinct full-body poses of the same person. Not 4, not 8. Exactly 6.
4.  **Content - Face:** The face from the user's input image MUST be realistically integrated onto the model in all six poses.
5.  **Watermark:** A text watermark with the words "${APP_NAME}" MUST be placed in the bottom-left corner of the final image. Make it subtle and stylish.

**CREATIVE TASK:**
-   **Style:** Create a high-fashion, professional, and glamorous photoshoot.
-   **Theme:** The user-provided theme is: '${stylePrompt}'. Interpret this theme creatively for the clothing, accessories, and the location/background.
-   **Composition:** Arrange the six poses artfully within the single 9:16 frame. Do not create a simple grid collage; make it look like a professional magazine layout.

**FAILURE to follow the 5 CRITICAL OUTPUT RULES will result in an incorrect output.**`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const finalImageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        
        return new Response(JSON.stringify({ imageUrl: finalImageUrl }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    const fallbackText = response.text ? response.text.trim() : "Nenhuma resposta de texto recebida.";
    return new Response(JSON.stringify({ error: 'A IA não retornou uma imagem. Resposta de texto: ' + fallbackText }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in backend function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown server error";
    return new Response(JSON.stringify({ error: `Falha ao gerar a imagem no servidor: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}