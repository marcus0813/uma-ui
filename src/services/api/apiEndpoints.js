const API_BASE_URL = process.env.REACT_APP_BACK_END_API;

export const API_ENDPOINTS = {
  user: {
    profile: `${API_BASE_URL}/user/profile`,
    profile_picture: `${API_BASE_URL}/user/profile-picture`,
  },
  login: `${API_BASE_URL}/auth/login`,
  refresh: `${API_BASE_URL}/auth/refresh`,
};

export default API_ENDPOINTS;
