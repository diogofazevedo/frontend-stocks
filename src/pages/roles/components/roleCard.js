import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const RoleCard = ({
  item,
  moreInfo = () => {},
  edit = () => {},
  remove = () => {},
  roleEdit,
  removeButtons = false,
  editAccess,
  deleteAccess,
}) => {
  return (
    <div
      className={`card card-content mb-3 p-2 border border-3 ${
        roleEdit === item ? "border-warning" : "border-white"
      }`}
    >
      <ul className="list-group border-0 dismiss-list">
        <li className="list-group-item border-0">Nome</li>
      </ul>
      <ul className="list-group border-0 me-3">
        <li className="list-group-item border-0 ps-0 bold">{item.name}</li>
      </ul>
      {!removeButtons && (
        <div className="actions-container">
          <button
            type="button"
            className="btn btn-primary ms-2"
            onClick={() => moreInfo(item)}
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          {editAccess && item.id !== 1 && (
            <button
              type="button"
              className="btn btn-warning ms-2"
              onClick={() => edit(item)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
          {deleteAccess && item.id !== 1 && (
            <button
              type="button"
              className="btn btn-danger ms-2"
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

export default RoleCard;
