import axios from 'axios';

const instance = axios.create({
  timeout: 15000 // 15 seconds
});

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const fetchGalaxyData = async (username, refresh = false) => {
  try {
    const url = `${API_BASE}/galaxy/${username}${refresh ? '?refresh=true' : ''}`;
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching galaxy data:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchAllGalaxyUsers = async () => {
  try {
    const response = await instance.get(`${API_BASE}/users/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all galaxy users:', error.response?.data || error.message);
    return [];
  }
};

export const fetchUserCount = async () => {
  try {
    const response = await instance.get(`${API_BASE}/stats`);
    return response.data.userCount;
  } catch (error) {
    console.error('Error fetching user count:', error.response?.data || error.message);
    return 0;
  }
};
export const checkBackendStatus = async () => {
  try {
    const response = await instance.get(`${API_BASE}/health`);
    const isLive = response.data?.status === 'ok';
    console.log(`[API] Health check result: ${isLive ? 'OK' : 'FAIL'}`);
    return isLive;
  } catch (error) {
    return false;
  }
};
