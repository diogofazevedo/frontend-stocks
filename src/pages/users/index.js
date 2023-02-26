import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

import { userService } from "../../services/user.service";
import { roleService } from "../../services/role.service";

import UserCard from "./components/userCard";
import RegisterForm from "./components/registerForm";
import EditForm from "./components/editForm";
import ModalDelete from "./components/modalDelete";

function Users() {
  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingForm, setLoadingForm] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [registerMode, setRegisterMode] = useState(true);
  const [roles, setRoles] = useState([]);
  const [userEdit, setUserEdit] = useState({});
  const [userDelete, setUserDelete] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const filteredList = usersList.filter(
    (x) =>
      x.name.includes(search) ||
      x.username.includes(search) ||
      x.role.name.includes(search)
  );

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
      if (window.innerWidth > 992) {
        setModalRegister(false);
        setModalEdit(false);
      }
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

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

  function edit(user) {
    setUserEdit(user);
    setRegisterMode(false);

    if (windowSize[0] <= 992) {
      setModalEdit(true);
    }
  }

  function remove(user) {
    setUserDelete(user);
    setModalDelete(true);
  }

  function changeMode() {
    setRegisterMode(true);
    setUserEdit({});

    if (windowSize[0] <= 992) {
      setModalRegister(true);
    }
  }

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
              type="search"
              className="form-control"
              placeholder="Pesquise um utilizador..."
              aria-label="Pesquisa"
            />
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary ms-2"
          onClick={() => changeMode()}
        >
          <span className="plus-icon">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
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
                return (
                  <UserCard
                    key={index}
                    item={item}
                    edit={edit}
                    remove={remove}
                    userEdit={userEdit}
                  />
                );
              })}
              {filteredList.length === 0 && search !== "" && (
                <label>
                  Não foram encontrados resultados para a pesquisa '{search}'.
                </label>
              )}
            </>
          )}
        </div>
        {windowSize[0] > 992 && (
          <div className="card rigth-container">
            {isLoadingForm ? (
              <span className="spinner-border spinner-border-lg align-self-center mt-3" />
            ) : (
              <>
                {registerMode ? (
                  <RegisterForm roles={roles} getUsers={getUsers} />
                ) : (
                  <EditForm
                    roles={roles}
                    getUsers={getUsers}
                    userEdit={userEdit}
                    changeMode={changeMode}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
      <ModalDelete
        userDelete={userDelete}
        show={modalDelete}
        handleClose={() => setModalDelete(false)}
        getUsers={getUsers}
        changeMode={changeMode}
        userEdit={userEdit}
      />
      <Modal
        show={modalRegister}
        onHide={() => setModalRegister(false)}
        size="lg"
        backdrop="static"
        keyboard={false}
        centered
      >
        <div className="card border-0">
          <RegisterForm
            roles={roles}
            getUsers={getUsers}
            closeForm={() => setModalRegister(false)}
            closeButton
          />
        </div>
      </Modal>
      <Modal
        show={modalEdit}
        onHide={() => setModalEdit(false)}
        size="lg"
        backdrop="static"
        keyboard={false}
        centered
      >
        <div className="card border-0">
          <EditForm
            roles={roles}
            getUsers={getUsers}
            userEdit={userEdit}
            changeMode={changeMode}
            closeForm={() => {
              setModalEdit(false);
            }}
            closeButton
          />
        </div>
      </Modal>
    </div>
  );
}

export default Users;
