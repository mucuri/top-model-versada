// This service now sends requests to our own secure backend endpoint
// instead of directly to the Google Gemini API, to protect the API key.

export const generateFashionImage = async (base64Image: string, stylePrompt: string): Promise<string> => {
  const controller = new AbortController();
  // Set a 30-second client-side timeout for the request
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  let response: Response;
  try {
    // We send the image data and prompt to our backend function.
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, stylePrompt }),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      // This catches our client-side 30s timeout
      throw new Error("A geração demorou muito (30s) e foi cancelada. Por favor, tente novamente.");
    }
    // This catches network errors (e.g., no internet)
    throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
  } finally {
      clearTimeout(timeoutId);
  }

  // --- Process the response with robust error handling ---
  let data;
  try {
    // The critical step: attempt to parse the response as JSON.
    // If this fails, we know the server sent something else (like an HTML error page).
    data = await response.json();
  } catch (error) {
    // This block catches JSON parsing errors, which IS the "Unexpected token 'A'..." issue.
    if (response.status === 504) {
      throw new Error("O servidor demorou muito para responder (IA muito ocupada). Por favor, tente novamente em alguns instantes.");
    }
    // For any other non-JSON response, it's an unexpected server crash.
    throw new Error(`O servidor retornou uma resposta inesperada (status ${response.status}). Tente novamente.`);
  }

  // If we successfully parsed JSON, check if it's a success or a server-defined error.
  if (!response.ok) {
    // The server sent a JSON error payload, e.g., { "error": "Something went wrong" }
    // The 'data' variable holds the parsed JSON from the try-catch block above.
    throw new Error(data.error || `Ocorreu um erro no servidor (status ${response.status}).`);
  }

  // If we are here, response was OK and JSON was parsed successfully.
  if (data && data.imageUrl) {
    return data.imageUrl;
  } else {
    // The response was successful, but the expected data wasn't there.
    throw new Error("A resposta do servidor foi bem-sucedida, mas não continha uma imagem.");
  }
};