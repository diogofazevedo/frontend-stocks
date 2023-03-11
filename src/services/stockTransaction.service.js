import { api } from "./api";

export const stockTransactionService = {
  getAll,
  getAllByType,
  create,
  update,
};

function getAll() {
  return api.get("StockTransactions");
}

function getAllByType(type) {
  return api.get(`StockTransactions/${type}`);
}

function create(params) {
  return api.post("StockTransactions", params);
}

function update(id, params) {
  return api.put(`StockTransactions/${id}`, params);
}
