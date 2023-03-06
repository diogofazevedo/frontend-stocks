import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode, faFont } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CloseButton } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { locationService } from "../../../services/location.service";

const EditForm = ({
  getLocations = () => {},
  locationEdit,
  changeMode = () => {},
  closeForm = () => {},
  closeButton = false,
}) => {
  const initialValues = {
    code: locationEdit.code,
    description: locationEdit.description,
  };

  const validationSchema = Yup.object().shape({
    description: Yup.string(),
  });

  function onSubmit({ description }, { setSubmitting, resetForm }) {
    const user = JSON.parse(localStorage.getItem("user"));
    locationService
      .update(locationEdit.code, { description, user: user.username })
      .then((res) => {
        toast.success(res.message);
        resetForm();
        closeForm();
        getLocations();
        changeMode();
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="form">
          <div className="card-header bg-warning border-0 d-flex justify-content-between align-items-center">
            <h4 className="text-dark m-0">Editar</h4>
            {closeButton && (
              <CloseButton
                variant="dark"
                disabled={isSubmitting}
                onClick={closeForm}
              />
            )}
          </div>
          <div className="card-body">
            <div className="form-group mb-2">
              <label className="mb-1">Código *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faBarcode} className="text-white" />
                </span>
                <Field
                  name="code"
                  type="text"
                  className={
                    "form-control" +
                    (errors.code && touched.code ? " is-invalid" : "")
                  }
                  disabled
                />
                <ErrorMessage
                  name="code"
                  component="span"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="mb-1">Descrição</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faFont} className="text-white" />
                </span>
                <Field
                  name="description"
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="form-row m-3 d-flex justify-content-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-dark"
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm me-2" />
              )}
              Submeter
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditForm;
