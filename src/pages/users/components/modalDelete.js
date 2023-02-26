import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { userService } from "../../../services/user.service";

import UserCard from "./userCard";

const ModalDelete = ({
  userDelete,
  show,
  handleClose = () => {},
  getUsers = () => {},
  changeMode = () => {},
  userEdit,
}) => {
  const [isSubmitting, setSubmitting] = useState(false);

  function onSubmit() {
    setSubmitting(true);
    userService
      .delete(userDelete.id)
      .then((res) => {
        handleClose();
        toast.success(res.message);

        if (userEdit.id === userDelete.id) {
          changeMode();
        }

        getUsers();
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
          <h4>Tem a certeza que pretende eliminar este utilizador?</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UserCard item={userDelete} removeButtons />
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
