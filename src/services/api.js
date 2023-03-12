import axios from "axios";
import { userService } from "./user.service";

const API = axios.create({
  baseURL: "http://stockswebapi.azurewebsites.net",
  responseType: "json",
});

export const api = {
  get,
  post,
  put,
  delete: _delete,
};

async function get(url) {
  const requestOptions = {
    headers: authHeader(),
  };

  try {
    const response = await API.get(url, requestOptions);
    return handleResponse(response);
  } catch (error) {
    return handleResponse(error.response);
  }
}

async function post(url, body, contentType = "application/json") {
  const requestOptions = {
    headers: {
      "Content-Type": contentType,
      ...authHeader(),
    },
    credentials: "include",
  };

  try {
    const response = await API.post(url, body, requestOptions);
    return handleResponse(response);
  } catch (error) {
    return handleResponse(error.response);
  }
}

async function put(url, body, contentType = "application/json") {
  const requestOptions = {
    headers: { "Content-Type": contentType, ...authHeader() },
  };

  try {
    const response = await API.put(url, body, requestOptions);
    return handleResponse(response);
  } catch (error) {
    return handleResponse(error.response);
  }
}

async function _delete(url) {
  const requestOptions = {
    headers: authHeader(),
  };

  try {
    const response = await API.delete(url, requestOptions);
    return handleResponse(response);
  } catch (error) {
    return handleResponse(error.response);
  }
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
  if (response.status === 200) {
    return response.data;
  }

  if ([401, 403].includes(response.status)) {
    userService.logout();
  }

  const error = (response.data && response.data.message) || response.statusText;
  return Promise.reject(error);
}
