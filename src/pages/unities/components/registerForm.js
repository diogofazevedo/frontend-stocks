import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa0, faBarcode, faSignature } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CloseButton } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { unityService } from "../../../services/unity.service";

const RegisterForm = ({
  getUnities = () => {},
  closeForm = () => {},
  closeButton = false,
}) => {
  const initialValues = {
    code: "",
    name: "",
    decimals: 0,
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required("Código é obrigatório."),
    name: Yup.string().required("Nome é obrigatório."),
    decimals: Yup.number()
      .integer()
      .required("Decimais são obrigatórias.")
      .min(0, "Decimais inválidas."),
  });

  function onSubmit({ code, name, decimals }, { setSubmitting, resetForm }) {
    const user = JSON.parse(localStorage.getItem("user"));
    unityService
      .create({ code: code.toUpperCase(), name, decimals, user: user.username })
      .then((res) => {
        toast.success(res.message);
        resetForm();
        closeForm();
        getUnities();
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
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="form">
          <div className="card-header bg-primary border-0 d-flex justify-content-between align-items-center">
            <h4 className="text-white m-0">Criar</h4>
            {closeButton && (
              <CloseButton
                variant="white"
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
                />
                <ErrorMessage
                  name="code"
                  component="span"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group mb-2">
              <label className="mb-1">Nome *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faSignature} className="text-white" />
                </span>
                <Field
                  name="name"
                  type="text"
                  className={
                    "form-control" +
                    (errors.name && touched.name ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="name"
                  component="span"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="mb-1">Decimais *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={fa0} className="text-white" />
                </span>
                <Field
                  name="decimals"
                  type="number"
                  className={
                    "form-control" +
                    (errors.decimals && touched.decimals ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="decimals"
                  component="span"
                  className="invalid-feedback"
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

export default RegisterForm;
