import { api } from "./api";

export const stockService = {
  getAllByProduct,
};

function getAllByProduct(product) {
  return api.get(`Stock?product=${product}`);
}
