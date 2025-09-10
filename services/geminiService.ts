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
      throw new Error("error_timeout_30s");
    }
    // This catches network errors (e.g., no internet)
    throw new Error("error_connection");
  } finally {
      clearTimeout(timeoutId);
  }

  // --- Process the response with robust error handling ---
  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (response.status === 504) {
      throw new Error("error_server_timeout");
    }
    throw new Error(`error_unexpected_response|${response.status}`);
  }

  if (!response.ok) {
     const serverError = data.error || `error_server_status|${response.status}`;
     // Check for specific error messages from the backend
     if (typeof serverError === 'string' && serverError.includes("INTERNAL")) {
         return "error_google_internal";
     }
     if (typeof serverError === 'string' && serverError.includes("INVALID_ARGUMENT")) {
         return "error_google_invalid_argument";
     }
    throw new Error(serverError);
  }

  if (data && data.imageUrl) {
    return data.imageUrl;
  } else {
    throw new Error("error_no_image_in_response");
  }
};