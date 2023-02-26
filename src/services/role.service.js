import { api } from "./api";

export const roleService = {
  getAll,
  create,
  update,
  delete: _delete,
};

function getAll() {
  return api.get("Roles");
}

function create(params) {
  return api.post("Roles", params);
}

function update(id, params) {
  return api.put(`Roles/${id}`, params);
}

function _delete(id) {
  return api.delete(`Roles/${id}`);
}
