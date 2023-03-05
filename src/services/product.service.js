import { api } from "./api";

export const productService = {
  getAll,
  create,
  update,
  delete: _delete,
};

function getAll() {
  return api.get("Products");
}

function create(params) {
  return api.post("Products", params, "multipart/form-data");
}

function update(code, params) {
  return api.put(`Products/${code}`, params, "multipart/form-data");
}

function _delete(code) {
  return api.delete(`Products/${code}`);
}
