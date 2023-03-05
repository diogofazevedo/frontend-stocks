import { api } from "./api";

export const categoryService = {
  getAll,
  create,
  update,
  delete: _delete,
};

function getAll() {
  return api.get("Categories");
}

function create(params) {
  return api.post("Categories", params);
}

function update(code, params) {
  return api.put(`Categories/${code}`, params);
}

function _delete(code) {
  return api.delete(`Categories/${code}`);
}
