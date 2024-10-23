import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'https://sah-platform-api-egghayfcc4ddeuae.canadacentral-01.azurewebsites.net/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiInstance;
