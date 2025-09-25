import { ParseMenuRequestBody, ParseMenuResponseBody, ParsedMenu, isParsedMenu } from '../types';

// You'll need to replace this with your actual API endpoint
const API_BASE_URL = 'https://trycarte.netlify.app';

class ParseMenuService {
  async parseMenu(imageBase64: string, preferredLanguage: string = 'English'): Promise<ParsedMenu> {
    const requestBody: ParseMenuRequestBody = {
      imageBase64,
      preferredLanguage,
    };

    console.log('Making API request to:', `${API_BASE_URL}/api/parse`);
    console.log('Request body size:', JSON.stringify(requestBody).length);

    try {
      const response = await fetch(`${API_BASE_URL}/api/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: ParseMenuResponseBody = await response.json();

      if (!data.ok) {
        throw new Error(data.error);
      }

      if (!isParsedMenu(data.menu)) {
        throw new Error('Invalid menu format received from server');
      }

      // Store original image data for re-translation
      data.menu.originalImageData = imageBase64;
      data.menu.targetLanguage = preferredLanguage;

      return data.menu;
    } catch (error) {
      console.error('Detailed error:', error);
      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  async translateMenu(menu: ParsedMenu, targetLanguage: string): Promise<ParsedMenu> {
    if (!menu.originalImageData) {
      throw new Error('Original image data not available for re-translation');
    }

    console.log('Re-translating menu to:', targetLanguage);
    return await this.parseMenu(menu.originalImageData, targetLanguage);
  }
}

export const parseMenuService = new ParseMenuService();