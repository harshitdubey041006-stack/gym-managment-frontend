// api.js
import axios from "axios";

function createApiClient({ refreshPath, storageKey,authPaths = [] }) {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });
  // const baseURL = "http://192.168.137.1:3000"; // ← your laptop's IP from ipconfig, same port as backend

  // const api = axios.create({
  //   baseURL,
  //   withCredentials: true,
  // });

  let accessToken = localStorage.getItem(storageKey) || null; // restore on page load

  const setAccessToken = (token) => {
    accessToken = token;
    if (token) {
      localStorage.setItem(storageKey, token);
    } else {
      localStorage.removeItem(storageKey);
    }
  };
  const getAccessToken = () => accessToken;

  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  let isRefreshing = false;
  let refreshQueue = [];

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (!originalRequest) {
      return Promise.reject(error);
    }
      
      // 👇 ADD THIS: define isAuthEndpoint before the if-check
      const isAuthEndpoint =
        originalRequest.url === refreshPath ||
        authPaths.includes(originalRequest.url);



      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          }).then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          });
        }

        isRefreshing = true;
        try {
          const { data } = await api.post(refreshPath);
          const newToken = data.accessToken ?? data.memberAccessToken;
          setAccessToken(newToken);
          refreshQueue.forEach(({ resolve }) => resolve(newToken));
          refreshQueue = [];
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          refreshQueue.forEach(({ reject }) => reject(refreshError));
          refreshQueue = [];
          setAccessToken(null);

          const loginPath = storageKey === "ownerAccessToken" ? "/login" : "/memberLogin";
              if (window.location.pathname !== loginPath) {
                  window.location.href = loginPath;
  }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return { api, setAccessToken, getAccessToken };
}

// export const { api: ownerApi, setAccessToken: setOwnerAccessToken, getAccessToken: getOwnerAccessToken } =
//   createApiClient({ refreshPath: "/auth/refresh", storageKey: "ownerAccessToken" });

// export const { api: memberApi, setAccessToken: setMemberAccessToken, getAccessToken: getMemberAccessToken } =
//   createApiClient({ refreshPath: "/memberRegistration/refresh", storageKey: "memberAccessToken" });

  export const { api: ownerApi, setAccessToken: setOwnerAccessToken, getAccessToken: getOwnerAccessToken } =
  createApiClient({
    refreshPath: "/auth/refresh",
    storageKey: "ownerAccessToken",
    authPaths: ["/auth/login", "/auth/register"],
  });

export const { api: memberApi, setAccessToken: setMemberAccessToken, getAccessToken: getMemberAccessToken } =
  createApiClient({
    refreshPath: "/memberRegistration/refresh",
    storageKey: "memberAccessToken",
    authPaths: ["/memberRegistration/login", "/memberRegistration/register"],
  });