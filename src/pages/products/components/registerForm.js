import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignature,
  faListAlt,
  faBarcode,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CloseButton } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { productService } from "../../../services/product.service";

const RegisterForm = ({
  categories,
  unities,
  getProducts = () => {},
  closeForm = () => {},
  closeButton = false,
}) => {
  const fileRef = useRef();

  const initialValues = {
    code: "",
    name: "",
    categoryCode: "",
    lotManagement: false,
    serialNumberManagement: false,
    locationManagement: false,
    unityCode: "",
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required("Código é obrigatório."),
    name: Yup.string().required("Nome é obrigatório."),
    categoryCode: Yup.string().required("Categoria é obrigatória."),
    lotManagement: Yup.bool(),
    serialNumberManagement: Yup.bool(),
    locationManagement: Yup.bool(),
    unityCode: Yup.string().required("Unidade é obrigatória."),
  });

  function onSubmit(
    {
      code,
      name,
      categoryCode,
      lotManagement,
      serialNumberManagement,
      locationManagement,
      unityCode,
    },
    { setSubmitting, resetForm }
  ) {
    const user = JSON.parse(localStorage.getItem("user"));

    const bodyFormData = new FormData();
    bodyFormData.append("code", code.toUpperCase());
    bodyFormData.append("name", name);
    bodyFormData.append("categoryCode", categoryCode);
    bodyFormData.append("file", fileRef.current.files[0]);
    bodyFormData.append("lotManagement", lotManagement);
    bodyFormData.append("serialNumberManagement", serialNumberManagement);
    bodyFormData.append("locationManagement", locationManagement);
    bodyFormData.append("unityCode", unityCode);
    bodyFormData.append("user", user.username);

    productService
      .create(bodyFormData)
      .then((res) => {
        toast.success(res.message);
        resetForm();
        fileRef.current.value = "";
        closeForm();
        getProducts();
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
            <div className="form-group mb-2">
              <label className="mb-1">Categoria *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faListAlt} className="text-white" />
                </span>
                <Field
                  name="categoryCode"
                  as="select"
                  className={
                    "form-select" +
                    (errors.categoryCode && touched.categoryCode
                      ? " is-invalid"
                      : "")
                  }
                >
                  <option value={""}>Escolha uma categoria ...</option>
                  {categories.map((item) => {
                    return (
                      <option value={item.code}>
                        {item.name} ({item.code})
                      </option>
                    );
                  })}
                </Field>
                <ErrorMessage
                  name="categoryCode"
                  component="span"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group mb-2">
              <label className="mb-1">Unidade *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faListAlt} className="text-white" />
                </span>
                <Field
                  name="unityCode"
                  as="select"
                  className={
                    "form-select" +
                    (errors.unityCode && touched.unityCode ? " is-invalid" : "")
                  }
                >
                  <option value={""}>Escolha uma unidade ...</option>
                  {unities.map((item) => {
                    return (
                      <option value={item.code}>
                        {item.name} ({item.code})
                      </option>
                    );
                  })}
                </Field>
                <ErrorMessage
                  name="unityCode"
                  component="span"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group mb-2">
              <label htmlFor="file" className="form-label me-2">
                Imagem
              </label>
              <input
                ref={fileRef}
                name="file"
                type="file"
                className="form-control"
                multiple={false}
                accept="image/*"
              />
            </div>
            <div className="form-group">
              <label className="mb-1">Gestões</label>
              <div className="input-group">
                <div className="form-check form-switch">
                  <Field
                    name="lotManagement"
                    type="checkbox"
                    className="form-check-input p-2"
                    role="switch"
                  />
                  <label className="form-check-label me-3">Lote</label>
                </div>
                <div className="form-check form-switch">
                  <Field
                    name="serialNumberManagement"
                    type="checkbox"
                    className="form-check-input p-2"
                    role="switch"
                  />
                  <label className="form-check-label me-3">
                    Número de série
                  </label>
                </div>
                <div className="form-check form-switch">
                  <Field
                    name="locationManagement"
                    type="checkbox"
                    className="form-check-input p-2"
                    role="switch"
                  />
                  <label className="form-check-label me-3">Localização</label>
                </div>
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
