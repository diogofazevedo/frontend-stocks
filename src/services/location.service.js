import { api } from "./api";

export const locationService = {
  getAll,
  create,
  update,
  delete: _delete,
};

function getAll() {
  return api.get("Locations");
}

function create(params) {
  return api.post("Locations", params);
}

function update(code, params) {
  return api.put(`Locations/${code}`, params);
}

function _delete(code) {
  return api.delete(`Locations/${code}`);
}
