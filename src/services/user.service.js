import React from "react";
import { Navigate } from "react-router-dom";

import api from "./api";

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

function login(username, password) {
  return api.post("Users/authenticate", { username, password }).then((user) => {
    localStorage.setItem("user", JSON.stringify(user));
    startRefreshTokenTimer();
    return user;
  });
}

function logout() {
  api.post("Users/revoke-token", {});
  stopRefreshTokenTimer();
  localStorage.removeItem("user");
  return <Navigate to="/login" />;
}

function refreshToken() {
  return api.post("Users/refresh-token", {}).then((user) => {
    localStorage.setItem("user", JSON.stringify(user));
    startRefreshTokenTimer();
    return user;
  });
}

function register(params) {
  return api.post("Users/register", params);
}

function getAll() {
  return api.get("Users");
}

function getById(id) {
  return api.get(`Users/${id}`);
}

function update(id, params) {
  return api.put(`Users/${id}`, params).then((user) => {
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  });
}

function _delete(id) {
  return api.delete(`Users/${id}`).then((x) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (id === user.id) {
      logout();
    }
    return x;
  });
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
