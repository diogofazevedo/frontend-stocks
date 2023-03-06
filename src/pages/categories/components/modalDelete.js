import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { categoryService } from "../../../services/category.service";

import CategoryCard from "./categoryCard";

const ModalDelete = ({
  categoryDelete,
  show,
  handleClose = () => {},
  getCategories = () => {},
  changeMode = () => {},
  categoryEdit,
}) => {
  const [isSubmitting, setSubmitting] = useState(false);

  function onSubmit() {
    setSubmitting(true);
    categoryService
      .delete(categoryDelete.code)
      .then((res) => {
        handleClose();
        toast.success(res.message);

        if (categoryEdit.code === categoryDelete.code) {
          changeMode();
        }

        getCategories();
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
          <h4>Tem a certeza que pretende eliminar esta categoria?</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CategoryCard item={categoryDelete} removeButtons />
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
