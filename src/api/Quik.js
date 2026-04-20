const BASE_URL = import.meta.env.VITE_SERVER_URL || "";

// 🔹 Global config (you can change per project)
const config = {
  csrf: {
    cookieName: "XSRF-TOKEN",
    headerName: "X-XSRF-TOKEN",
    enabled: true,
  },
};

// 🔹 Cookie reader
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

// 🔹 Detect FormData
const isFormData = (data) => data instanceof FormData;

// 🔹 Core request
const request = async (method, url, options = {}) => {
  const { data, headers = {}, signal, timeout = 10000 } = options;

  const finalHeaders = { ...headers };

  // 🔥 Auto JSON / FormData
  let body;
  if (data) {
    if (isFormData(data)) {
      body = data;
    } else {
      body = JSON.stringify(data);
      finalHeaders["Content-Type"] = "application/json";
    }
  }

  // 🔥 Dynamic CSRF
  if (config.csrf.enabled) {
    const token = getCookie(config.csrf.cookieName);
    if (token) {
      finalHeaders[config.csrf.headerName] = token;
    }
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      credentials: "include",
      headers: finalHeaders,
      body,
      signal: signal || controller.signal,
    });

    clearTimeout(id);

    const contentType = res.headers.get("content-type");

    const responseData = contentType?.includes("json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      throw {
        message: responseData?.message || "Request failed",
        status: res.status,
        data: responseData,
      };
    }

    return responseData;
  } catch (err) {
    throw {
      message: err.message || "Network error",
      status: err.status || null,
      data: err.data || null,
    };
  }
};

// 🔹 API methods
export const api = {
  get: (url, options) => request("GET", url, options),
  post: (url, data, options = {}) => request("POST", url, { ...options, data }),
  put: (url, data, options = {}) => request("PUT", url, { ...options, data }),
  delete: (url, options) => request("DELETE", url, options),
};
 