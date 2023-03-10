import React from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";

import StockEntryCard from "./stockEntryCard";

const ModalMoreInfo = ({ stockEntryInfo, show, handleClose = () => {} }) => {
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
        <StockEntryCard item={stockEntryInfo} removeButtons />
        <div className="d-flex">
          <ul className="list-group border-0">
            <li className="list-group-item border-0">Criação</li>
            {stockEntryInfo.location && (
              <li className="list-group-item border-0 pt-0">Localização</li>
            )}
            {stockEntryInfo.observation && (
              <li className="list-group-item border-0 pt-0">Observações</li>
            )}
          </ul>
          <ul className="list-group border-0 me-3">
            <li className="list-group-item border-0 ps-0 bold">
              {moment(stockEntryInfo.created).format("DD/MM/YYYY HH:mm:ss")}
            </li>
            {stockEntryInfo.location && (
              <li className="list-group-item border-0 ps-0 pt-0 bold">
                {stockEntryInfo.location.description} (
                {stockEntryInfo.location.code})
              </li>
            )}
            {stockEntryInfo.observation && (
              <li className="list-group-item border-0 ps-0 pt-0 bold">
                {stockEntryInfo.observation}
              </li>
            )}
          </ul>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMoreInfo;
