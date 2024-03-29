import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const UnityCard = ({
  item,
  edit = () => {},
  remove = () => {},
  unityEdit,
  removeButtons = false,
  editAccess,
  deleteAccess,
}) => {
  return (
    <div
      className={`card card-content mb-3 p-2 border border-3 ${
        unityEdit === item ? "border-warning" : "border-white"
      }`}
    >
      <ul className="list-group border-0 dismiss-list">
        <li className="list-group-item border-0">Código</li>
        <li className="list-group-item border-0 pt-0">Nome</li>
        <li className="list-group-item border-0 pt-0">Decimais</li>
      </ul>
      <ul className="list-group border-0 me-3 info-container">
        <li className="list-group-item border-0 ps-0 bold ellipsis">
          {item.code}
        </li>
        <li className="list-group-item border-0 ps-0 pt-0 bold ellipsis">
          {item.name}
        </li>
        <li className="list-group-item border-0 ps-0 pt-0 bold ellipsis">
          {item.decimals}
        </li>
      </ul>
      {!removeButtons && (
        <div className="actions-container">
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
              className="btn btn-danger"
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

export default UnityCard;
