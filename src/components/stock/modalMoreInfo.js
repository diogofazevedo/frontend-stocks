import React from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";

import StockCard from "./stockCard";

const ModalMoreInfo = ({ stockInfo, show, handleClose = () => {} }) => {
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
        <StockCard item={stockInfo} removeButtons />
        <div className="d-flex">
          <ul className="list-group border-0">
            <li className="list-group-item border-0">Criação</li>
            {stockInfo.location && (
              <li className="list-group-item border-0 pt-0">Localização</li>
            )}
            {stockInfo.observation && (
              <li className="list-group-item border-0 pt-0">Observações</li>
            )}
          </ul>
          <ul className="list-group border-0 me-3 info-container">
            <li className="list-group-item border-0 ps-0 bold ellipsis">
              {moment(stockInfo.created).format("DD/MM/YYYY HH:mm:ss")}
            </li>
            {stockInfo.location && (
              <li className="list-group-item border-0 ps-0 pt-0 bold ellipsis">
                {stockInfo.location.description} ({stockInfo.location.code})
              </li>
            )}
            {stockInfo.observation && (
              <li className="list-group-item border-0 ps-0 pt-0 bold">
                {stockInfo.observation}
              </li>
            )}
          </ul>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMoreInfo;
