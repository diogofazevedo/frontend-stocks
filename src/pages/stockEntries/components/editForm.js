import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarcode,
  fa0,
  faListAlt,
  faBox,
  faLocationDot,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CloseButton } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { stockTransactionService } from "../../../services/stockTransaction.service";

const EditForm = ({
  products,
  locations,
  getStockEntries = () => {},
  stockEntryEdit,
  changeMode = () => {},
  closeForm = () => {},
  closeButton = false,
}) => {
  const initialValues = {
    productCode: stockEntryEdit.product?.code,
    quantity: stockEntryEdit.quantity,
    lot: stockEntryEdit.lot,
    serialNumber: stockEntryEdit.serialNumber,
    locationCode: stockEntryEdit.location?.code,
    observation: stockEntryEdit.observation,
  };

  const validationSchema = Yup.object().shape({
    observation: Yup.string(),
  });

  function onSubmit({ observation }, { setSubmitting, resetForm }) {
    const user = JSON.parse(localStorage.getItem("user"));
    stockTransactionService
      .update(stockEntryEdit.id, { observation, user: user.username })
      .then((res) => {
        toast.success(res.message);
        resetForm();
        closeForm();
        getStockEntries();
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
      {({ values, isSubmitting }) => (
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
              <label className="mb-1">Artigo *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faListAlt} className="text-white" />
                </span>
                <Field
                  name="productCode"
                  as="select"
                  className="form-select"
                  disabled
                >
                  {products.map((item) => {
                    return (
                      <option value={item.code}>
                        {item.name} ({item.code})
                      </option>
                    );
                  })}
                </Field>
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
                  className="form-control"
                  disabled
                />
              </div>
            </div>
            {values.lot && (
              <div className="form-group mb-2">
                <label className="mb-1">Lote *</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-0">
                    <FontAwesomeIcon icon={faBox} className="text-white" />
                  </span>
                  <Field
                    name="lot"
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
              </div>
            )}
            {values.serialNumber && (
              <div className="form-group mb-2">
                <label className="mb-1">Número de série *</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-0">
                    <FontAwesomeIcon icon={faBarcode} className="text-white" />
                  </span>
                  <Field
                    name="serialNumber"
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
              </div>
            )}
            {values.locationCode && (
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
                    className="form-select"
                    disabled
                  >
                    {locations.map((item) => {
                      return (
                        <option value={item.code}>
                          {item.description} ({item.code})
                        </option>
                      );
                    })}
                  </Field>
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
