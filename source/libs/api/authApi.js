import axios from 'axios';
const authApi = axios.create({
  baseURL: 'https://orkidehapp.ir/api/auth/user/',
});
// Default POST headers for all instances
authApi.defaults.headers.post['Content-Type'] = 'multipart/form-data';

// Intercept all responses
authApi.interceptors.response.use(
  async (response) => {
    return response;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);

export default authApi;
