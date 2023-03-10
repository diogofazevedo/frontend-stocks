import { api } from "./api";

export const stockTransactionService = {
  getAll,
  create,
  update,
};

function getAll(type) {
  return api.get(`StockTransactions?type=${type}`);
}

function create(params) {
  return api.post("StockTransactions", params);
}

function update(id, params) {
  return api.put(`StockTransactions/${id}`, params);
}
