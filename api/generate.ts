// IMPORTANT: This file should be placed in the `api` directory at the root of your project.
// It acts as a secure backend function that runs on a server (like Vercel), not in the browser.
// This protects your API key.

import { GoogleGenAI, Modality } from "@google/genai";

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

    // A more powerful and detailed prompt, as requested, to guide the AI towards a high-quality result.
    // NOTE: A more complex prompt may increase generation time, risking a timeout on free server plans.
    const prompt = `Generate a single, vertical, full-body, professional high-fashion photoshoot image. 
The model is the person in the user's photo. Their face must be accurately and realistically represented.
The fashion style must be: '${stylePrompt}'.
The setting should be a professional studio with dramatic, cinematic lighting.
The final image must be photorealistic, high-resolution, and have the quality of a magazine cover.
Do not generate collages, text, or watermarks. Only the single, clean image.`;

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
    
    // If the loop finishes without returning an image, the AI failed to generate one.
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
