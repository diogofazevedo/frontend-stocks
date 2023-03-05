import { api } from "./api";

export const unityService = {
  getAll,
  create,
  update,
  delete: _delete,
};

function getAll() {
  return api.get("Unities");
}

function create(params) {
  return api.post("Unities", params);
}

function update(code, params) {
  return api.put(`Unities/${code}`, params);
}

function _delete(code) {
  return api.delete(`Unities/${code}`);
}
