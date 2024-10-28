import axios from 'axios';
const SERVICE = '/users/';

const UserService = {
  get: async (username) => {
    try {
      const response = await axios.get(SERVICE + username);
      return response.data;
    } catch (error) {
      return error.response;
    }
  },
  login: async (username, password) => {
    try {
      const response = await axios.post(SERVICE + 'login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      return error.response;
    }
  },
  register: async (first_name, last_name, username, password) => {
    try {
      const response = await axios.post(SERVICE + 'register', {
        first_name,
        last_name,
        username,
        password,
      });
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  follow: async (username) => {
    try {
      const response = await axios.post(SERVICE + 'follow', {
        username,
      });
      return response.data;
    } catch (error) {
      return error.response;
    }
  },
  unfollow: async (username) => {
    try {
      const response = await axios.post(SERVICE + 'unfollow', {
        username,
      });
      return response.data;
    } catch (error) {
      return error.response;
    }
  },
  profile: async () => {
    try {
      const response = await axios.get(SERVICE + 'profile');
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(SERVICE + 'logout');
      return response.data;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  },
};
export default UserService;
