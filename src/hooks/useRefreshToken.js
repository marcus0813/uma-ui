import { jwtDecode } from "jwt-decode";
import API_ENDPOINTS from "../services/api/apiEndpoints.js";
import { axiosPublic } from "../services/api/axios.js";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axiosPublic.get(API_ENDPOINTS.refresh, {
      withCredentials: true,
    });
    setAuth((prev) => {
      const decodeToken = jwtDecode(response.data);
      return { ...prev, email: decodeToken.email, userID: decodeToken.sub, accessToken: response.data };
    });
    return response.data;
  };
  return refresh;
};

export default useRefreshToken;
