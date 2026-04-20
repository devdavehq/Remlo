import { useState } from "react";
import { api } from "./Quik"; // your wrapper

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wrap = async (fn) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fn();
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,

    get: (url, options) => wrap(() => api.get(url, options)),
    post: (url, data, options) => wrap(() => api.post(url, data, options)),
    put: (url, data, options) => wrap(() => api.put(url, data, options)),
    delete: (url, options) => wrap(() => api.delete(url, options)),
  };
};
