import { WildcardOrderRequest, WildcardOrderResponse } from '../types';

const API_BASE_URL = 'https://trycarte.netlify.app';

class WildcardService {
  async getWildcardOrder(request: WildcardOrderRequest): Promise<WildcardOrderResponse> {
    console.log('Making wildcard API request to:', `${API_BASE_URL}/api/wildcard`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/wildcard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('Wildcard response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Wildcard error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: WildcardOrderResponse = await response.json();

      if (!data.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Wildcard service error:', error);
      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      throw error;
    }
  }
}

export const wildcardService = new WildcardService();