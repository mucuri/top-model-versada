// This service now sends requests to our own secure backend endpoint
// instead of directly to the Google Gemini API, to protect the API key.

export const generateFashionImage = async (base64Image: string, stylePrompt: string): Promise<string> => {
  const controller = new AbortController();
  // Set a 30-second timeout for the request
  const timeoutId = setTimeout(() => controller.abort(), 30000);

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
      signal: controller.signal, // Pass the AbortSignal to the fetch request
    });
    
    // If the request completes, clear the timeout
    clearTimeout(timeoutId);

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
    // Clear the timeout in case of an error as well
    clearTimeout(timeoutId);

    if (error instanceof Error) {
        if (error.name === 'AbortError') {
            throw new Error("A geração demorou muito. O servidor pode estar ocupado. Por favor, tente novamente em alguns instantes.");
        }
        // Pass the original error message along
        throw new Error(error.message);
    }
    throw new Error("Falha ao gerar a imagem. Por favor, tente novamente.");
  }
};