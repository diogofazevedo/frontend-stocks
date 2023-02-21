import { api } from "./api";

export const userService = {
  login,
  logout,
  refreshToken,
  getAll,
  getById,
  register,
  update,
  delete: _delete,
};

async function login(username, password) {
  const user = await api.post("Users/authenticate", { username, password });
  localStorage.setItem("user", JSON.stringify(user));
  startRefreshTokenTimer();
  return user;
}

function logout() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    api.post("Users/revoke-token", { token: user.refreshToken });
    stopRefreshTokenTimer();
    localStorage.removeItem("user");
  }
}

async function refreshToken() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const newUser = await api.post("Users/refresh-token", {
      token: user.refreshToken,
    });
    localStorage.setItem("user", JSON.stringify(newUser));
    startRefreshTokenTimer();
    return user;
  }
}

function register(params) {
  return api.post("Users/register", params, "multipart/form-data");
}

function getAll() {
  return api.get("Users");
}

function getById(id) {
  return api.get(`Users/${id}`);
}

async function update(id, params) {
  const user = await api.put(`Users/${id}`, params);
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

async function _delete(id) {
  const x = await api.delete(`Users/${id}`);
  const user = JSON.parse(localStorage.getItem("user"));
  if (id === user.id) {
    logout();
  }
  return x;
}

let refreshTokenTimeout;

function startRefreshTokenTimer() {
  const user = JSON.parse(localStorage.getItem("user"));
  const jwtToken = JSON.parse(atob(user.jwtToken.split(".")[1]));

  const expires = new Date(jwtToken.exp * 1000);
  const timeout = expires.getTime() - Date.now() - 60 * 1000;
  refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

function stopRefreshTokenTimer() {
  clearTimeout(refreshTokenTimeout);
}
