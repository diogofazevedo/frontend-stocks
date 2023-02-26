import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignature } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CloseButton } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { roleService } from "../../../services/role.service";
import { userService } from "../../../services/user.service";

import Accesses from "../../../helpers/accesses";
import AccessInput from "./accessInput";

const EditForm = ({
  getRoles = () => {},
  roleEdit,
  changeMode = () => {},
  closeForm = () => {},
  closeButton = false,
}) => {
  const navigate = useNavigate();
  const [accesses, setAccesses] = useState(roleEdit.accesses);

  const initialValues = {
    name: roleEdit.name,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório."),
  });

  useEffect(() => {
    setAccesses(roleEdit.accesses);
  }, [roleEdit]);

  function onSubmit({ name }, { setSubmitting, resetForm }) {
    if (accesses.length === 0) {
      toast.error("Selecione, no mínimo, um acesso.");
      setSubmitting(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    roleService
      .update(roleEdit.id, { name, accesses, user: user.username })
      .then((res) => {
        toast.success(res.message);
        resetForm();
        closeForm();

        if (roleEdit.id === user.role.id) {
          userService.logout();
          navigate("/login");
          return;
        }

        getRoles();
        changeMode();
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setSubmitting(false));
  }

  function changeAccesses(access, checked) {
    if (checked) {
      setAccesses([...accesses, access]);
    } else {
      setAccesses((current) => current.filter((x) => x.name !== access.name));
    }
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
              <label className="mb-1">Acessos *</label>
              <div className="input-group mb-1 pb-1 border-bottom">
                {Accesses.users.map((item, index) => {
                  return (
                    <AccessInput
                      index={index}
                      item={item}
                      changeAccesses={changeAccesses}
                      accesses={accesses}
                    />
                  );
                })}
              </div>
              <div className="input-group mb-1 pb-1 border-bottom">
                {Accesses.roles.map((item, index) => {
                  return (
                    <AccessInput
                      index={index}
                      item={item}
                      changeAccesses={changeAccesses}
                      accesses={accesses}
                    />
                  );
                })}
              </div>
              <div className="input-group mb-1 pb-1 border-bottom">
                {Accesses.categories.map((item, index) => {
                  return (
                    <AccessInput
                      index={index}
                      item={item}
                      changeAccesses={changeAccesses}
                      accesses={accesses}
                    />
                  );
                })}
              </div>
              <div className="input-group mb-1 pb-1 border-bottom">
                {Accesses.products.map((item, index) => {
                  return (
                    <AccessInput
                      index={index}
                      item={item}
                      changeAccesses={changeAccesses}
                      accesses={accesses}
                    />
                  );
                })}
              </div>
              <div className="input-group mb-1 pb-1 border-bottom">
                {Accesses.stockEntries.map((item, index) => {
                  return (
                    <AccessInput
                      index={index}
                      item={item}
                      changeAccesses={changeAccesses}
                      accesses={accesses}
                    />
                  );
                })}
              </div>
              <div className="input-group">
                {Accesses.stockExits.map((item, index) => {
                  return (
                    <AccessInput
                      index={index}
                      item={item}
                      changeAccesses={changeAccesses}
                      accesses={accesses}
                    />
                  );
                })}
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
