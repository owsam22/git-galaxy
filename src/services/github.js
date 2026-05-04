import axios from 'axios';
import { mockData } from './mockData';

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

export const fetchUserData = async (username) => {
  try {
    const [profileRes, reposRes, eventsRes] = await Promise.all([
      api.get(`/users/${username}`),
      api.get(`/users/${username}/repos?per_page=100&sort=pushed`),
      api.get(`/users/${username}/events/public?per_page=100`)
    ]);

    return {
      profile: profileRes.data,
      repos: reposRes.data,
      events: eventsRes.data
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error.response?.data || error.message);
    console.warn("Falling back to mock data for demonstration due to API error/limits.");
    return mockData;
  }
};
