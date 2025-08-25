import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const httpConfig: AxiosRequestConfig = {
  baseURL:
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_GRAPHQL_ENDPOINT,
  timeout: 20000, // 20 seconds huy và báo lỗi nếu quá time
  headers: {
    "Content-Type": "application/json",
    "Apollo-Require-Preflight": "true",
  },
};

export const httpInstance: AxiosInstance = axios.create(httpConfig);

httpInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log("HTTP Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

httpInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log("HTTP Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    if (error.response) {
      console.error("❌ Response Error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.response.config?.url,
      });

      if (error.response.status === 401) {
        localStorage.removeItem("auth-token");
        window.location.href = "/auth";
      }
    } else if (error.request) {
      console.error("❌ Network Error:", error.request);
    } else {
      console.error("❌ Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export const uploadInstance: AxiosInstance = axios.create({
  ...httpConfig,
  timeout: 120000, // 2 phút cho upload
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

uploadInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log("Upload Request:", {
        method: config.method?.toUpperCase(),
        data: config.data instanceof FormData ? "FormData" : config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Upload Request Error:", error);
    return Promise.reject(error);
  }
);

uploadInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("Upload Response:", {
        status: response.status,
      });
    }
    return response;
  },
  (error) => {
    console.error("❌ Upload Response Error:", error);
    return Promise.reject(error);
  }
);

export default httpInstance;
