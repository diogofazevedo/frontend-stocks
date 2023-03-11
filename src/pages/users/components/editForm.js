import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignature,
  faUser,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CloseButton } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { userService } from "../../../services/user.service";

const EditForm = ({
  roles,
  getUsers = () => {},
  userEdit,
  changeMode = () => {},
  closeForm = () => {},
  closeButton = false,
}) => {
  const navigate = useNavigate();
  const fileRef = useRef();

  const initialValues = {
    name: userEdit.name,
    username: userEdit.username,
    roleId: userEdit.role?.id,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório."),
    username: Yup.string().required("Utilizador é obrigatório."),
    roleId: Yup.number().min(1, "Papel é obrigatório."),
  });

  function onSubmit({ name, username, roleId }, { setSubmitting, resetForm }) {
    const bodyFormData = new FormData();
    bodyFormData.append("name", name);
    bodyFormData.append("username", username.toLowerCase());
    bodyFormData.append("file", fileRef.current.files[0]);
    bodyFormData.append("roleId", roleId);

    userService
      .update(userEdit.id, bodyFormData)
      .then((res) => {
        toast.success(res.message);
        resetForm();
        fileRef.current.value = "";
        closeForm();

        const user = JSON.parse(localStorage.getItem("user"));
        if (user.username === username && user.role.id !== roleId) {
          userService.logout();
          navigate("/login");
        }

        getUsers();
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
              <label className="mb-1">Utilizador *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faUser} className="text-white" />
                </span>
                <Field
                  name="username"
                  type="text"
                  className={
                    "form-control" +
                    (errors.username && touched.username ? " is-invalid" : "")
                  }
                  disabled
                />
                <ErrorMessage
                  name="username"
                  component="span"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group mb-2">
              <label className="mb-1">Papel *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faUserGear} className="text-white" />
                </span>
                <Field
                  name="roleId"
                  as="select"
                  className={
                    "form-select" +
                    (errors.roleId && touched.roleId ? " is-invalid" : "")
                  }
                >
                  <option value={0}>Escolha um papel ...</option>
                  {roles.map((item) => {
                    return <option value={item.id}>{item.name}</option>;
                  })}
                </Field>
                <ErrorMessage
                  name="roleId"
                  component="span"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group">
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
