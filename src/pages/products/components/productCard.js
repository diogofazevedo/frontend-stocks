import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const ProductCard = ({
  item,
  moreInfo = () => {},
  edit = () => {},
  remove = () => {},
  productEdit,
  removeButtons = false,
  editAccess,
  deleteAccess,
}) => {
  return (
    <div
      className={`card card-content mb-3 border border-3 ${
        productEdit === item ? "border-warning" : "border-white"
      }`}
    >
      <div className="image-container ms-2 me-3">
        {item.imageUrl && (
          <img src={item.imageUrl} alt="Imagem" className="product-image" />
        )}
      </div>
      <ul className="list-group border-0 dismiss-list">
        <li className="list-group-item border-0 ps-0">Código</li>
        <li className="list-group-item border-0 pt-0 ps-0">Nome</li>
        <li className="list-group-item border-0 pt-0 ps-0">Categoria</li>
      </ul>
      <ul className="list-group border-0 me-3">
        <li className="list-group-item border-0 ps-0 bold">{item.code}</li>
        <li className="list-group-item border-0 ps-0 pt-0 bold">{item.name}</li>
        <li className="list-group-item border-0 ps-0 pt-0 bold">
          {item.category.name} ({item.category.code})
        </li>
      </ul>
      {!removeButtons && (
        <div className="actions-container">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={() => moreInfo(item)}
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          {editAccess && (
            <button
              type="button"
              className="btn btn-warning me-2"
              onClick={() => edit(item)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
          {deleteAccess && (
            <button
              type="button"
              className="btn btn-danger me-2"
              onClick={() => remove(item)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
