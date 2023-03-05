import React from "react";
import { Modal } from "react-bootstrap";

import ProductCard from "./productCard";

const ModalMoreInfo = ({ productInfo, show, handleClose = () => {} }) => {
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
        <ProductCard item={productInfo} removeButtons />
        <div className="mx-3 mb-2">
          Unidade
          <label className="ms-2 bold">
            {productInfo.stockUnity?.name} ({productInfo.stockUnity?.code})
          </label>
        </div>
        <label className="d-flex border-bottom mx-3 pb-1 bold">Gestões</label>
        <ul className="list-group border-0 d-flex flex-row">
          {productInfo.lotManagement && (
            <li className="list-group-item border-0">Lote</li>
          )}
          {productInfo.serialNumberManagement && (
            <li className="list-group-item border-0">Número de série</li>
          )}
          {productInfo.locationManagement && (
            <li className="list-group-item border-0">Localização</li>
          )}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMoreInfo;
