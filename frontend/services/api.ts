const API_URL = 'http://192.168.1.75:5000/api';

export const fetchName = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/name`);
    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error('Error fetching name:', error);
    throw error;
  }
}; 