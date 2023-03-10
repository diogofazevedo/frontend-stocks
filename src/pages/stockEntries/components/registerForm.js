import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  fa0,
  faBarcode,
  faBox,
  faFont,
  faListAlt,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CloseButton } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { stockTransactionService } from "../../../services/stockTransaction.service";

const RegisterForm = ({
  products,
  locations,
  getStockEntries = () => {},
  closeForm = () => {},
  closeButton = false,
}) => {
  const initialValues = {
    productCode: "",
    quantity: "",
    lot: "",
    serialNumber: "",
    locationCode: "",
    observation: "",
  };

  const validationSchema = Yup.object().shape({
    productCode: Yup.string().required("Artigo é obrigatório."),
    quantity: Yup.number()
      .required("Quantidade é obrigatória.")
      .moreThan(0, "Quantidade inválida."),
    lot: Yup.string().when("productCode", (productsCode, field) => {
      return products.find((x) => x.code === productsCode[0])?.lotManagement
        ? field.required("Lote é obrigatório.")
        : field;
    }),
    serialNumber: Yup.string().when("productCode", (productsCode, field) => {
      return products.find((x) => x.code === productsCode[0])
        ?.serialNumberManagement
        ? field.required("Número de série é obrigatório.")
        : field;
    }),
    locationCode: Yup.string().when("productCode", (productsCode, field) => {
      return products.find((x) => x.code === productsCode[0])
        ?.locationManagement
        ? field.required("Localização é obrigatória.")
        : field;
    }),
    observation: Yup.string(),
  });

  function onSubmit(
    { productCode, quantity, lot, serialNumber, locationCode, observation },
    { setSubmitting, resetForm }
  ) {
    const user = JSON.parse(localStorage.getItem("user"));
    const product = products.find((x) => x.code === productCode);

    const transaction = {
      productCode: productCode,
      quantity: +quantity.toFixed(product.stockUnity.decimals),
      unityCode: product.stockUnity.code,
      lot: lot,
      serialNumber: serialNumber,
      locationCode: locationCode,
      observation: observation,
      user: user.username,
    };

    stockTransactionService
      .create(transaction)
      .then((res) => {
        toast.success(res.message);
        resetForm();
        closeForm();
        getStockEntries();
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
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
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
              <label className="mb-1">Artigo *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faListAlt} className="text-white" />
                </span>
                <Field
                  name="productCode"
                  as="select"
                  className={
                    "form-control" +
                    (errors.productCode && touched.productCode
                      ? " is-invalid"
                      : "")
                  }
                  onChange={(e) => {
                    setFieldValue("productCode", e.target.value);
                    setFieldValue("lot", "");
                    setFieldValue("serialNumber", "");
                    if (
                      products.find((x) => x.code === e.target.value)
                        .serialNumberManagement
                    ) {
                      setFieldValue("quantity", 1);
                    }
                    setFieldValue("locationCode", "");
                  }}
                >
                  <option value={""}>Escolha um artigo ...</option>
                  {products.map((item) => {
                    return (
                      <option value={item.code}>
                        {item.name} ({item.code})
                      </option>
                    );
                  })}
                </Field>
                <ErrorMessage
                  name="productCode"
                  component="span"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group mb-2">
              <label className="mb-1">Quantidade *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark text-white border-0">
                  {products.find((x) => x.code === values.productCode)
                    ?.stockUnity.code ?? (
                    <FontAwesomeIcon icon={fa0} className="text-white" />
                  )}
                </span>
                <Field
                  name="quantity"
                  type="number"
                  className={
                    "form-control" +
                    (errors.quantity && touched.quantity ? " is-invalid" : "")
                  }
                  disabled={
                    products.find((x) => x.code === values.productCode)
                      ?.serialNumberManagement
                  }
                />
                <ErrorMessage
                  name="quantity"
                  component="span"
                  className="invalid-feedback"
                />
              </div>
            </div>
            {products.find((x) => x.code === values.productCode)
              ?.lotManagement && (
              <div className="form-group mb-2">
                <label className="mb-1">Lote *</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-0">
                    <FontAwesomeIcon icon={faBox} className="text-white" />
                  </span>
                  <Field
                    name="lot"
                    type="text"
                    className={
                      "form-control" +
                      (errors.lot && touched.lot ? " is-invalid" : "")
                    }
                  />
                  <ErrorMessage
                    name="lot"
                    component="span"
                    className="invalid-feedback"
                  />
                </div>
              </div>
            )}
            {products.find((x) => x.code === values.productCode)
              ?.serialNumberManagement && (
              <div className="form-group mb-2">
                <label className="mb-1">Número de série *</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-0">
                    <FontAwesomeIcon icon={faBarcode} className="text-white" />
                  </span>
                  <Field
                    name="serialNumber"
                    type="text"
                    className={
                      "form-control" +
                      (errors.serialNumber && touched.serialNumber
                        ? " is-invalid"
                        : "")
                    }
                  />
                  <ErrorMessage
                    name="serialNumber"
                    component="span"
                    className="invalid-feedback"
                  />
                </div>
              </div>
            )}
            {products.find((x) => x.code === values.productCode)
              ?.locationManagement && (
              <div className="form-group mb-2">
                <label className="mb-1">Localização *</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-0">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-white"
                    />
                  </span>
                  <Field
                    name="locationCode"
                    as="select"
                    className={
                      "form-control" +
                      (errors.locationCode && touched.locationCode
                        ? " is-invalid"
                        : "")
                    }
                  >
                    <option value={""}>Escolha uma localização ...</option>
                    {locations.map((item) => {
                      return (
                        <option value={item.code}>
                          {item.description} ({item.code})
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage
                    name="locationCode"
                    component="span"
                    className="invalid-feedback"
                  />
                </div>
              </div>
            )}
            <div className="form-group">
              <label className="mb-1">Observações</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faFont} className="text-white" />
                </span>
                <Field
                  name="observation"
                  as="textarea"
                  className="form-control"
                />
                <ErrorMessage
                  name="observation"
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
