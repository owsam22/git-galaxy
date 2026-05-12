import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const fetchGalaxyData = async (username, refresh = false) => {
  try {
    const url = `${API_BASE}/galaxy/${username}${refresh ? '?refresh=true' : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching galaxy data:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchAllGalaxyUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/users/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all galaxy users:', error.response?.data || error.message);
    return [];
  }
};

export const fetchUserCount = async () => {
  try {
    const response = await axios.get(`${API_BASE}/stats`);
    return response.data.userCount;
  } catch (error) {
    console.error('Error fetching user count:', error.response?.data || error.message);
    return 0;
  }
};
