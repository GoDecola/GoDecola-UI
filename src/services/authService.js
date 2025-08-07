import api from "./api";

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/signout", {});
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
  } finally {
    localStorage.removeItem("token");
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error;
  }
};

export default { login, logout, signup };