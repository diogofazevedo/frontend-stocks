import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignature,
  faUser,
  faKey,
  faUserGear,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CloseButton } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { userService } from "../../../services/user.service";

const RegisterForm = ({
  roles,
  getUsers = () => {},
  closeForm = () => {},
  closeButton = false,
}) => {
  const fileRef = useRef();

  const [passwordShown, setPasswordShown] = useState(false);

  const initialValues = {
    name: "",
    username: "",
    password: "",
    roleId: 0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório."),
    username: Yup.string().required("Utilizador é obrigatório."),
    password: Yup.string()
      .required("Palavra-passe é obrigatória.")
      .min(8, "Palavra-passe é demasiado curta (min. 8 caracteres)."),
    roleId: Yup.number().min(1, "Papel é obrigatório."),
  });

  function onSubmit(
    { name, username, password, roleId },
    { setSubmitting, resetForm }
  ) {
    const bodyFormData = new FormData();
    bodyFormData.append("name", name);
    bodyFormData.append("username", username.toLowerCase());
    bodyFormData.append("password", password);
    bodyFormData.append("file", fileRef.current.files[0]);
    bodyFormData.append("roleId", roleId);

    userService
      .register(bodyFormData)
      .then((res) => {
        toast.success(res.message);
        resetForm();
        fileRef.current.value = "";
        closeForm();
        getUsers();
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
            <h4 className="text-white m-0">Registar</h4>
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
                />
                <ErrorMessage
                  name="username"
                  component="span"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group mb-2">
              <label className="mb-1">Palavra-passe *</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0">
                  <FontAwesomeIcon icon={faKey} className="text-white" />
                </span>
                <Field
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  className={
                    "form-control" +
                    (errors.password && touched.password ? " is-invalid" : "")
                  }
                />
                <span
                  className="input-group-text bg-dark border-0"
                  onClick={() => setPasswordShown(!passwordShown)}
                >
                  <FontAwesomeIcon
                    icon={passwordShown ? faEyeSlash : faEye}
                    className="text-white"
                  />
                </span>
                <ErrorMessage
                  name="password"
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
                    "form-control" +
                    (errors.roleId && touched.roleId ? " is-invalid" : "")
                  }
                >
                  <option value={0}>Escolha um papel...</option>
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

export default RegisterForm;
