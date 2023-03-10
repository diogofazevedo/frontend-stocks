import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faEdit } from "@fortawesome/free-solid-svg-icons";

const StockEntryCard = ({
  item,
  moreInfo = () => {},
  edit = () => {},
  stockEntryEdit,
  removeButtons = false,
  editAccess,
}) => {
  return (
    <div
      className={`card card-content mb-3 p-2 border border-3 ${
        stockEntryEdit === item ? "border-warning" : "border-white"
      }`}
    >
      <ul className="list-group border-0 dismiss-list">
        <li className="list-group-item border-0">Artigo</li>
        <li className="list-group-item border-0 pt-0">Quantidade</li>
        {item.lot && <li className="list-group-item border-0 pt-0">Lote</li>}
        {item.serialNumber && (
          <li className="list-group-item border-0 pt-0">Nº série</li>
        )}
      </ul>
      <ul className="list-group border-0 me-3">
        <li className="list-group-item border-0 ps-0 bold">
          {item.product.name} ({item.product.code})
        </li>
        <li className="list-group-item border-0 ps-0 pt-0 bold">
          {item.quantity} {item.unity.code}
        </li>
        {item.lot && (
          <li className="list-group-item border-0 ps-0 pt-0 bold">
            {item.lot}
          </li>
        )}
        {item.serialNumber && (
          <li className="list-group-item border-0 ps-0 pt-0 bold">
            {item.serialNumber}
          </li>
        )}
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
        </div>
      )}
    </div>
  );
};

export default StockEntryCard;
