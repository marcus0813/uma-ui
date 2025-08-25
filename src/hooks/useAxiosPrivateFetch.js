import { useState, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useAxiosPrivateFetch = () => {
  const [requestMethod, setRequestMethod] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchData = useCallback(
    async (method, url, payload = null) => {
      setLoading(true);
      setErrorMessage(null);

      try {
        // Detect payload type
        const isFormData = payload instanceof FormData;

        const response = await axiosPrivate({
          method: method,
          url: url,
          data: payload,
          headers: isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
        });

        setStatusCode(response.status);
        setData(response.data);
      } catch (err) {
        if (!err?.response) {
          setStatusCode(404);
          setErrorMessage("No Server Response");
        } else {
          setStatusCode(err.response.status || 500);
          setErrorMessage(err.response.data || "Unexpected error");
        }
      } finally {
        setLoading(false);
      }
    },
    [axiosPrivate]
  );

  const GET = useCallback(
    (url) => {
      setRequestMethod("GET");
      return fetchData(requestMethod, url);
    },
    [fetchData]
  );
  const POST = useCallback(
    (url, payload) => {
      setRequestMethod("POST");
      return fetchData("POST", url, payload);
    },
    [fetchData]
  );
  const PUT = useCallback(
    (url, payload) => {
      setRequestMethod("PUT");
      return fetchData("PUT", url, payload);
    },
    [fetchData]
  );

  return { requestMethod, data, loading, statusCode, errorMessage, GET, POST, PUT };
};

export default useAxiosPrivateFetch;
