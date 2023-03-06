import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { locationService } from "../../../services/location.service";

import LocationCard from "./locationCard";

const ModalDelete = ({
  locationDelete,
  show,
  handleClose = () => {},
  getLocations = () => {},
  changeMode = () => {},
  locationEdit,
}) => {
  const [isSubmitting, setSubmitting] = useState(false);

  function onSubmit() {
    setSubmitting(true);
    locationService
      .delete(locationDelete.code)
      .then((res) => {
        handleClose();
        toast.success(res.message);

        if (locationEdit.code === locationDelete.code) {
          changeMode();
        }

        getLocations();
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
    >
      <Modal.Header closeButton={!isSubmitting} className="border-0">
        <Modal.Title>
          <h4>Tem a certeza que pretende eliminar esta localização?</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LocationCard item={locationDelete} removeButtons />
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="danger" onClick={handleClose} disabled={isSubmitting}>
          Não
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting && (
            <Spinner animation="border" size="sm" className="me-2" />
          )}
          Sim
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDelete;
