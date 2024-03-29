import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const UserCard = ({
  item,
  edit = () => {},
  remove = () => {},
  userEdit,
  removeButtons = false,
  editAccess,
  deleteAccess,
}) => {
  return (
    <div
      className={`card card-content mb-3 border border-3 ${
        userEdit === item ? "border-warning" : "border-white"
      }`}
    >
      <div className="image-container ms-2 me-3">
        {item.imageUrl && (
          <img src={item.imageUrl} alt="Imagem" className="user-image" />
        )}
      </div>
      <ul className="list-group border-0 dismiss-list">
        <li className="list-group-item border-0 ps-0">Nome</li>
        <li className="list-group-item border-0 pt-0 ps-0">Papel</li>
      </ul>
      <ul className="list-group border-0 me-3 info-container">
        <li className="list-group-item border-0 ps-0 bold ellipsis">
          {item.name} ({item.username})
        </li>
        <li className="list-group-item border-0 ps-0 pt-0 bold ellipsis">
          {item.role.name}
        </li>
      </ul>
      {!removeButtons && (
        <div className="actions-container">
          {editAccess && item.username !== "admin" && (
            <button
              type="button"
              className="btn btn-warning me-2"
              onClick={() => edit(item)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
          {deleteAccess && item.username !== "admin" && (
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

export default UserCard;
