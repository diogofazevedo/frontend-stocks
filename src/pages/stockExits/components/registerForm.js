import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { stockService } from "../../../services/stock.service";

const RegisterForm = ({
  products,
  getStockExits = () => {},
  closeForm = () => {},
  closeButton = false,
}) => {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [stock, setStock] = useState([]);
  const [unities, setUnities] = useState([]);
  const [lots, setLots] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [locations, setLocations] = useState([]);

  const initialValues = {
    productCode: "",
    quantity: "",
    unityCode: "",
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
    unityCode: Yup.string(),
    lot: Yup.string().when("productCode", (productsCode, field) => {
      return lots.length > 0 ? field.required("Lote é obrigatório.") : field;
    }),
    serialNumber: Yup.string().when("productCode", (productsCode, field) => {
      return serialNumbers.length > 0
        ? field.required("Número de série é obrigatório.")
        : field;
    }),
    locationCode: Yup.string().when("productCode", (productsCode, field) => {
      return locations.length > 0
        ? field.required("Localização é obrigatória.")
        : field;
    }),
    observation: Yup.string(),
  });

  function onSubmit(
    {
      productCode,
      quantity,
      unityCode,
      lot,
      serialNumber,
      locationCode,
      observation,
    },
    { setSubmitting, resetForm }
  ) {
    const user = JSON.parse(localStorage.getItem("user"));
    const stockLine = stock.find(
      (x) =>
        (unityCode ? x.unity.code === unityCode : true) &&
        x.lot === lot &&
        x.serialNumber === serialNumber &&
        (locationCode ? x.location.code === locationCode : true)
    );

    if (!stockLine) {
      toast.error("Stock não encontrado.");
      setSubmitting(false);
      return;
    }

    const quantityTemp = +quantity.toFixed(stockLine.unity.decimals);
    if (stockLine.quantity - quantityTemp < 0) {
      toast.error(
        `Quantidade a tratar (${quantityTemp} ${unityCode}) superior à quantidade em stock (${stockLine.quantity} ${unityCode}).`
      );
      setSubmitting(false);
      return;
    }

    const transaction = {
      stockId: stockLine.id,
      productCode: productCode,
      quantity: quantityTemp,
      unityCode: unityCode,
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
        setUnities([]);
        setLots([]);
        setSerialNumbers([]);
        setLocations([]);
        closeForm();
        getStockExits();
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setSubmitting(false));
  }

  function cleanForm(setFieldValue = () => {}) {
    setFieldValue("unityCode", "");
    setUnities([]);

    setFieldValue("lot", "");
    setLots([]);

    setFieldValue("serialNumber", "");
    setSerialNumbers([]);

    setFieldValue("locationCode", "");
    setLocations([]);
  }

  function getStock(product, setFieldValue = () => {}) {
    setLoading(true);
    stockService
      .getAllByProduct(product)
      .then((stock) => {
        setStock(stock);
        if (stock.length === 0) {
          toast.error(`Stock inexistente para o artigo ${product}.`);
          return;
        }

        const stockUnities = stock.filter((x) => x.unity);
        if (stockUnities.length > 0) {
          const unitiesTemp = [
            ...new Map(
              stockUnities.map((item) => [item.unity["code"], item.unity])
            ).values(),
          ];
          setUnities(unitiesTemp);
          setFieldValue("unityCode", unitiesTemp[0].code);
        }

        const stockLots = stock.filter((x) => x.lot);
        if (stockLots.length > 0) {
          setLots([...new Set(stockLots.map((data) => data.lot))]);
        }

        const stockSerialNumbers = stock.filter((x) => x.serialNumber);
        if (stockSerialNumbers.length > 0) {
          setSerialNumbers([
            ...new Set(stockSerialNumbers.map((data) => data.serialNumber)),
          ]);
          setFieldValue("quantity", 1);
        }

        const stockLocations = stock.filter((x) => x.location);
        if (stockLocations.length > 0) {
          setLocations([
            ...new Map(
              stockLocations.map((item) => [
                item.location["code"],
                item.location,
              ])
            ).values(),
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => (
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
                    "form-select" +
                    (errors.productCode && touched.productCode
                      ? " is-invalid"
                      : "")
                  }
                  onChange={(e) => {
                    setFieldValue("productCode", e.target.value);
                    cleanForm(setFieldValue);
                    if (e.target.value) {
                      getStock(e.target.value, setFieldValue);
                    }
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
            {isLoading ? (
              <div className="d-flex justify-content-center mt-3">
                <span className="spinner-border spinner-border-lg" />
              </div>
            ) : (
              <>
                <div className="form-group mb-2">
                  <label className="mb-1">Quantidade *</label>
                  <div className="input-group">
                    {unities.length > 0 ? (
                      <Field
                        name="unityCode"
                        as="select"
                        className="form-select w-25"
                      >
                        {unities.map((item) => {
                          return <option value={item.code}>{item.code}</option>;
                        })}
                      </Field>
                    ) : (
                      <span className="input-group-text bg-dark text-white border-0">
                        <FontAwesomeIcon icon={fa0} className="text-white" />
                      </span>
                    )}
                    <Field
                      name="quantity"
                      type="number"
                      className={
                        "form-control w-75" +
                        (errors.quantity && touched.quantity
                          ? " is-invalid"
                          : "")
                      }
                      disabled={serialNumbers.length > 0}
                    />
                    <ErrorMessage
                      name="quantity"
                      component="span"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
                {lots.length > 0 && (
                  <div className="form-group mb-2">
                    <label className="mb-1">Lote *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-0">
                        <FontAwesomeIcon icon={faBox} className="text-white" />
                      </span>
                      <Field
                        name="lot"
                        as="select"
                        className={
                          "form-select" +
                          (errors.lot && touched.lot ? " is-invalid" : "")
                        }
                      >
                        <option value={""}>Escolha um lote ...</option>
                        {lots.map((item) => {
                          return <option value={item}>{item}</option>;
                        })}
                      </Field>
                      <ErrorMessage
                        name="lot"
                        component="span"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                )}
                {serialNumbers.length > 0 && (
                  <div className="form-group mb-2">
                    <label className="mb-1">Número de série *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-0">
                        <FontAwesomeIcon
                          icon={faBarcode}
                          className="text-white"
                        />
                      </span>
                      <Field
                        name="serialNumber"
                        as="select"
                        className={
                          "form-select" +
                          (errors.serialNumber && touched.serialNumber
                            ? " is-invalid"
                            : "")
                        }
                      >
                        <option value={""}>
                          Escolha um número de série ...
                        </option>
                        {serialNumbers.map((item) => {
                          return <option value={item}>{item}</option>;
                        })}
                      </Field>
                      <ErrorMessage
                        name="serialNumber"
                        component="span"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                )}
                {locations.length > 0 && (
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
                          "form-select" +
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
                  </div>
                </div>
              </>
            )}
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
