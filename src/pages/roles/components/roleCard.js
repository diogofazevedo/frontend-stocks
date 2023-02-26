import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const RoleCard = ({
  key,
  item,
  edit = () => {},
  remove = () => {},
  roleEdit,
  removeButtons = false,
}) => {
  return (
    <div
      key={key}
      className={`card card-content mb-3 p-2 border border-3 ${
        roleEdit === item ? "border-warning" : "border-white"
      }`}
    >
      <ul className="list-group border-0 dismiss-list">
        <li className="list-group-item border-0">Nome</li>
      </ul>
      <ul className="list-group d-inline-block text-truncate me-3 border-0">
        <li className="list-group-item border-0 ps-0 bold">{item.name}</li>
      </ul>
      {!removeButtons && (
        <div className="actions-container">
          <button
            type="button"
            className="btn btn-warning me-2"
            onClick={() => edit(item)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => remove(item)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleCard;
