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

async function update(id, params) {
  const role = await api.put(`Roles/${id}`, params);
  return role;
}

async function _delete(id) {
  const role = await api.delete(`Roles/${id}`);
  return role;
}
