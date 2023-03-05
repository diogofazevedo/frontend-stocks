import React from "react";
import { Modal } from "react-bootstrap";

import RoleCard from "./roleCard";

const ModalMoreInfo = ({ roleInfo, show, handleClose = () => {} }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title>
          <h4>Mais informações</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RoleCard item={roleInfo} removeButtons />
        <label className="d-flex border-bottom mx-3 pb-1 bold">Acessos</label>
        <ul className="list-group border-0 accesses-list">
          {roleInfo?.accesses?.map((item) => {
            return (
              <li className="list-group-item border-0 switch-input">
                {item.description}
              </li>
            );
          })}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMoreInfo;
