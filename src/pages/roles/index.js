import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

import { roleService } from "../../services/role.service";

import RoleCard from "./components/roleCard";
import RegisterForm from "./components/registerForm";
import EditForm from "./components/editForm";
import ModalDelete from "./components/modalDelete";
import ModalMoreInfo from "./components/modalMoreInfo";

function Roles() {
  const user = JSON.parse(localStorage.getItem("user"));

  const registerAccess = user?.role?.accesses?.find(
    (x) => x.name === "create_roles"
  );
  const editAccess = user?.role?.accesses?.find((x) => x.name === "edit_roles");
  const deleteAccess = user?.role?.accesses?.find(
    (x) => x.name === "delete_roles"
  );

  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const [registerMode, setRegisterMode] = useState(true);
  const [roleInfo, setRoleInfo] = useState({});
  const [roleEdit, setRoleEdit] = useState({});
  const [roleDelete, setRoleDelete] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalMoreInfo, setModalMoreInfo] = useState(false);

  const filteredList = rolesList.filter((x) => x.name.includes(search));

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
    getRoles();
  }, []);

  function getRoles() {
    setLoading(true);
    roleService
      .getAll()
      .then((roles) => {
        setRolesList(roles);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }

  function moreInfo(role) {
    setRoleInfo(role);
    setModalMoreInfo(true);
  }

  function edit(role) {
    setRoleEdit(role);
    setRegisterMode(false);

    if (windowSize[0] <= 992) {
      setModalEdit(true);
    }
  }

  function remove(role) {
    setRoleDelete(role);
    setModalDelete(true);
  }

  function changeMode() {
    setRegisterMode(true);
    setRoleEdit({});

    if (windowSize[0] <= 992) {
      setModalRegister(true);
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="header-container">
        <div className="left-header">
          <h3 className="mb-3 ps-1">Papéis</h3>
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
              placeholder="Pesquise um papel ..."
              aria-label="Pesquisa"
            />
          </div>
        </div>
        {registerAccess && (
          <button
            type="button"
            className="btn btn-primary ms-2"
            onClick={() => changeMode()}
          >
            <span className="plus-icon">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
            </span>
            Criar
          </button>
        )}
      </div>
      <div className="body-container">
        <div className="list-container">
          {isLoading ? (
            <span className="spinner-border spinner-border-lg" />
          ) : (
            <>
              {filteredList.map((item) => {
                return (
                  <RoleCard
                    item={item}
                    moreInfo={moreInfo}
                    edit={edit}
                    remove={remove}
                    roleEdit={roleEdit}
                    editAccess={editAccess}
                    deleteAccess={deleteAccess}
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
            {registerMode && registerAccess ? (
              <RegisterForm getRoles={getRoles} />
            ) : (
              !registerMode &&
              editAccess && (
                <EditForm
                  getRoles={getRoles}
                  roleEdit={roleEdit}
                  changeMode={changeMode}
                />
              )
            )}
            {!registerAccess && (
              <label className="ms-3 my-2 bold">
                Não tem permissões para criar papéis.
              </label>
            )}
            {!editAccess && (
              <label className="ms-3 mb-2 bold">
                Não tem permissões para editar papéis.
              </label>
            )}
          </div>
        )}
      </div>
      <ModalDelete
        roleDelete={roleDelete}
        show={modalDelete}
        handleClose={() => setModalDelete(false)}
        getRoles={getRoles}
        changeMode={changeMode}
        roleEdit={roleEdit}
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
            getRoles={getRoles}
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
            getRoles={getRoles}
            roleEdit={roleEdit}
            changeMode={changeMode}
            closeForm={() => {
              setModalEdit(false);
              setRoleEdit({});
              setRegisterMode(true);
            }}
            closeButton
          />
        </div>
      </Modal>
      <ModalMoreInfo
        roleInfo={roleInfo}
        show={modalMoreInfo}
        handleClose={() => setModalMoreInfo(false)}
      />
    </div>
  );
}

export default Roles;
