import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { userService } from "../../services/user.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faKey,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import Logo from "../../images/logo.png";
import "./index.css";

function Login() {
  const navigate = useNavigate();

  const [passwordShown, setPasswordShown] = useState(false);

  const user = localStorage.getItem("user");
  if (user) {
    return <Navigate to="/" />;
  }

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Utilizador é obrigatório."),
    password: Yup.string().required("Palavra-passe é obrigatória."),
  });

  function onSubmit({ username, password }, { setSubmitting }) {
    userService
      .login(username, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-8 offset-sm-2 mt-5">
          <div className="card m-3 login-card">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <h3 className="card-header bg-dark text-white">
                    Iniciar sessão
                  </h3>
                  <div className="card-body">
                    <div className="form-group mb-2">
                      <label className="mb-1">Utilizador</label>
                      <div className="input-group">
                        <span className="input-group-text bg-dark border-0">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="text-white"
                          />
                        </span>
                        <Field
                          name="username"
                          type="text"
                          className={
                            "form-control" +
                            (errors.username && touched.username
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="username"
                          component="span"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label className="mb-1">Palavra-passe</label>
                      <div className="input-group">
                        <span className="input-group-text bg-dark border-0">
                          <FontAwesomeIcon
                            icon={faKey}
                            className="text-white"
                          />
                        </span>
                        <Field
                          name="password"
                          type={passwordShown ? "text" : "password"}
                          className={
                            "form-control" +
                            (errors.password && touched.password
                              ? " is-invalid"
                              : "")
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
                    <div className="form-row">
                      <div className="form-group col submit-container">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-dark"
                        >
                          {isSubmitting ? (
                            <span className="spinner-border spinner-border-sm me-2" />
                          ) : (
                            <FontAwesomeIcon
                              icon={faLock}
                              className="text-white me-2"
                            />
                          )}
                          Entrar
                        </button>
                        <img src={Logo} alt="Logo" className="logo" />
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
