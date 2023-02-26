import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { roleService } from "../../../services/role.service";

import RoleCard from "./roleCard";

const ModalDelete = ({
  roleDelete,
  show,
  handleClose = () => {},
  getRoles = () => {},
  changeMode = () => {},
  roleEdit,
}) => {
  const [isSubmitting, setSubmitting] = useState(false);

  function onSubmit() {
    setSubmitting(true);
    roleService
      .delete(roleDelete.id)
      .then((res) => {
        handleClose();
        toast.success(res.message);

        if (roleEdit.id === roleDelete.id) {
          changeMode();
        }

        getRoles();
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
          <h4>Tem a certeza que pretende eliminar este papel?</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RoleCard item={roleDelete} removeButtons />
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
