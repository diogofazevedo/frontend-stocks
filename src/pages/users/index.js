import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faSignature,
  faUser,
  faKey,
  faUserGear,
  faEye,
  faEyeSlash,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { userService } from "../../services/user.service";
import { roleService } from "../../services/role.service";

import "./index.css";

function Users() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingForm, setLoadingForm] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [registerMode, setRegisterMode] = useState(true);
  const [roles, setRoles] = useState([]);
  const [passwordShown, setPasswordShown] = useState(false);

  const [modalDelete, setModalDelete] = useState(false);

  const filteredList = usersList.filter(
    (x) =>
      x.name.includes(search) ||
      x.username.includes(search) ||
      x.role.name.includes(search)
  );

  const initialValues = {
    name: "",
    username: "",
    password: "",
    roleId: 0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório."),
    username: Yup.string().required("Utilizador é obrigatório."),
    password: Yup.string().required("Palavra-passe é obrigatória."),
    roleId: Yup.number().min(1, "Papel é obrigatório."),
  });

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  function getUsers() {
    setLoading(true);
    userService
      .getAll()
      .then((users) => {
        setUsersList(users);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }

  function getRoles() {
    setLoadingForm(true);
    roleService
      .getAll()
      .then((roles) => {
        setRoles(roles);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoadingForm(false));
  }

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
        getUsers();
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setSubmitting(false));
  }

  function editMode(user) {
    setRegisterMode(false);
  }

  const UserCard = ({ key, item }) => {
    return (
      <div key={key} className="card card-content mb-3">
        <div className="image-container ms-2">
          {item.imageUrl && (
            <img src={item.imageUrl} alt="Imagem" className="user-image" />
          )}
        </div>
        <ul className="list-group">
          <li className="list-group-item border-0">Nome</li>
          <li className="list-group-item border-0 pt-0">Papel</li>
        </ul>
        <ul className="list-group d-inline-block text-truncate me-3">
          <li className="list-group-item border-0 ps-0 bold">
            {item.name} ({item.username})
          </li>
          <li className="list-group-item border-0 ps-0 pt-0 bold">
            {item.role.name}
          </li>
        </ul>
        <div className="actions-container">
          <button
            type="button"
            className="btn btn-warning me-2"
            onClick={() => editMode(item)}
          >
            <FontAwesomeIcon icon={faEdit} size="lg" />
          </button>
          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={() => setModalDelete(true)}
          >
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid p-4">
      <div className="header-container">
        <div className="left-header">
          <h3 className="mb-3 ps-1">Utilizadores</h3>
          <div className="input-group px-1">
            <span className="input-group-text bg-dark">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-white border-0"
              />
            </span>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Pesquise um utilizador..."
              aria-label="Pesquisa"
            />
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary ms-2"
          onClick={() => setRegisterMode(true)}
        >
          <span className="plus-icon">
            <FontAwesomeIcon icon={faPlus} size="lg" className="me-2" />
          </span>
          Registar
        </button>
      </div>
      <div className="body-container">
        <div className="list-container">
          {isLoading ? (
            <span className="spinner-border spinner-border-lg" />
          ) : (
            <>
              {filteredList.map((item, index) => {
                return <UserCard key={index} item={item} />;
              })}
              {filteredList.length === 0 && (
                <label>
                  Não foram encontrados resultados para a pesquisa '{search}'.
                </label>
              )}
            </>
          )}
        </div>
        <div className="card rigth-container">
          {isLoadingForm ? (
            <span className="spinner-border spinner-border-lg align-self-center mt-3" />
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="form">
                  <h4
                    className={`card-header ${
                      registerMode
                        ? "bg-primary text-white"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {registerMode ? "Registar" : "Editar"}
                  </h4>
                  <div className="card-body">
                    <div className="form-group mb-2">
                      <label className="mb-1">Nome *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-dark border-0">
                          <FontAwesomeIcon
                            icon={faSignature}
                            className="text-white"
                          />
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
                          disabled={!registerMode}
                        />
                        <ErrorMessage
                          name="username"
                          component="span"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label className="mb-1">Palavra-passe *</label>
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
                    <div className="form-group mb-3">
                      <label className="mb-1">Papel *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-dark border-0">
                          <FontAwesomeIcon
                            icon={faUserGear}
                            className="text-white"
                          />
                        </span>
                        <Field
                          name="roleId"
                          as="select"
                          className={
                            "form-control" +
                            (errors.roleId && touched.roleId
                              ? " is-invalid"
                              : "")
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
                      <label for="file" className="form-label me-2">
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;
