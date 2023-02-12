import React from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { userService } from "../../services/user.service";

function Login() {
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
        return <Navigate to="/" />;
      })
      .catch((error) => {
        setSubmitting(false);
        toast.error(error.response.data.message);
      });
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-8 offset-sm-2 mt-5">
          <div className="card m-3">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <h3 className="card-header">Login</h3>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Utilizador</label>
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
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group">
                      <label>Palavra-passe</label>
                      <Field
                        name="password"
                        type="password"
                        className={
                          "form-control" +
                          (errors.password && touched.password
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group col">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary"
                        >
                          {isSubmitting && (
                            <span className="spinner-border spinner-border-sm mr-1"></span>
                          )}
                          Login
                        </button>
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
