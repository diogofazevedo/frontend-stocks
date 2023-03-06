import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

import { locationService } from "../../services/location.service";

import LocationCard from "./components/locationCard";
import RegisterForm from "./components/registerForm";
import EditForm from "./components/editForm";
import ModalDelete from "./components/modalDelete";

function Locations() {
  const user = JSON.parse(localStorage.getItem("user"));

  const registerAccess = user?.role?.accesses?.find(
    (x) => x.name === "create_locations"
  );
  const editAccess = user?.role?.accesses?.find(
    (x) => x.name === "edit_locations"
  );
  const deleteAccess = user?.role?.accesses?.find(
    (x) => x.name === "delete_locations"
  );

  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [locationsList, setLocationsList] = useState([]);
  const [registerMode, setRegisterMode] = useState(true);
  const [locationEdit, setLocationEdit] = useState({});
  const [locationDelete, setLocationDelete] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const filteredList = locationsList.filter(
    (x) => x.code.includes(search) || x.description.includes(search)
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
    getLocations();
  }, []);

  function getLocations() {
    setLoading(true);
    locationService
      .getAll()
      .then((locations) => {
        setLocationsList(locations);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }

  function edit(location) {
    setLocationEdit(location);
    setRegisterMode(false);

    if (windowSize[0] <= 992) {
      setModalEdit(true);
    }
  }

  function remove(location) {
    setLocationDelete(location);
    setModalDelete(true);
  }

  function changeMode() {
    setRegisterMode(true);
    setLocationEdit({});

    if (windowSize[0] <= 992) {
      setModalRegister(true);
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="header-container">
        <div className="left-header">
          <h3 className="mb-3 ps-1">Localizações</h3>
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
              placeholder="Pesquise uma localização ..."
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
                  <LocationCard
                    item={item}
                    edit={edit}
                    remove={remove}
                    locationEdit={locationEdit}
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
              <RegisterForm getLocations={getLocations} />
            ) : (
              !registerMode &&
              editAccess && (
                <EditForm
                  getLocations={getLocations}
                  locationEdit={locationEdit}
                  changeMode={changeMode}
                />
              )
            )}
            {!registerAccess && (
              <label className="ms-3 my-2 bold">
                Não tem permissões para criar localizações.
              </label>
            )}
            {!editAccess && (
              <label className="ms-3 mb-2 bold">
                Não tem permissões para editar localizações.
              </label>
            )}
          </div>
        )}
      </div>
      <ModalDelete
        locationDelete={locationDelete}
        show={modalDelete}
        handleClose={() => setModalDelete(false)}
        getLocations={getLocations}
        changeMode={changeMode}
        locationEdit={locationEdit}
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
            getLocations={getLocations}
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
            getLocations={getLocations}
            locationEdit={locationEdit}
            changeMode={changeMode}
            closeForm={() => {
              setModalEdit(false);
              setLocationEdit({});
              setRegisterMode(true);
            }}
            closeButton
          />
        </div>
      </Modal>
    </div>
  );
}

export default Locations;
