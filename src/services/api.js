import axios from "axios";
import { userService } from "./user.service";

const api = axios.create({
  baseURL: "http://localhost:5295",
  responseType: "json",
});

export default {
  get,
  post,
  put,
  delete: _delete,
};

async function get(url) {
  const requestOptions = {
    headers: authHeader(),
  };
  const response = await api.get(url, requestOptions);
  return handleResponse(response);
}

async function post(url, body) {
  const requestOptions = {
    headers: { "Content-Type": "application/json", ...authHeader() },
    credentials: "include",
  };
  const response = await api.post(url, body, requestOptions);
  return handleResponse(response);
}

async function put(url, body) {
  const requestOptions = {
    headers: { "Content-Type": "application/json", ...authHeader() },
  };
  const response = await api.put(url, body, requestOptions);
  return handleResponse(response);
}

async function _delete(url) {
  const requestOptions = {
    headers: authHeader(),
  };
  const response = await api.delete(url, requestOptions);
  return handleResponse(response);
}

function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    return { Authorization: `Bearer ${user.jwtToken}` };
  } else {
    return {};
  }
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].includes(response.status)) {
        userService.logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
