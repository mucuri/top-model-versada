// This service now sends requests to our own secure backend endpoint
// instead of directly to the Google Gemini API, to protect the API key.

export const generateFashionImage = async (base64Image: string, stylePrompt: string): Promise<string> => {
  try {
    // We send the image data and prompt to our backend function.
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image,
        stylePrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error from server: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.imageUrl) {
        throw new Error("A IA não retornou uma imagem.");
    }

    return data.imageUrl;

  } catch (error) {
    console.error("Error calling backend to generate image:", error);
    if (error instanceof Error) {
        // Pass the error message along
        throw new Error(error.message);
    }
    throw new Error("Falha ao gerar a imagem. Por favor, tente novamente.");
  }
};
