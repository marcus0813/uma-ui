import { useState, useCallback } from "react";
import { axiosPublic } from "../services/api/axios";

const useAxiosPublicFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  const fetchData = useCallback(async (method, url, payload = null) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await axiosPublic({
        method,
        url,
        data: payload,
      });
      setStatusCode(response.status);
      setData(response.data);
    } catch (err) {
      if (!err?.response) {
        setStatusCode(404);
        setErrorMessage("No Server Response");
      } else {
        setStatusCode(err.response.status);
        setErrorMessage(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const GET = useCallback((url, options) => fetchData("GET", url, null, options), [fetchData]);
  const POST = useCallback((url, payload, options) => fetchData("POST", url, payload, options), [fetchData]);
  const PUT = useCallback((url, payload, options) => fetchData("PUT", url, payload, options), [fetchData]);

  return { data, loading, statusCode, errorMessage, GET, POST, PUT };
};

export default useAxiosPublicFetch;
