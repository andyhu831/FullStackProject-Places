import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbotCtrll = new AbortController();
      activeHttpRequests.current.push(httpAbotCtrll);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbotCtrll.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbotCtrll);
        if (!response.ok) {
          throw new Error(responseData.ErrorMessage);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.ErrorMessage);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
