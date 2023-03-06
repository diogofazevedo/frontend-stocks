import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

import { categoryService } from "../../services/category.service";

import CategoryCard from "./components/categoryCard";
import RegisterForm from "./components/registerForm";
import EditForm from "./components/editForm";
import ModalDelete from "./components/modalDelete";

function Categories() {
  const user = JSON.parse(localStorage.getItem("user"));

  const registerAccess = user?.role?.accesses?.find(
    (x) => x.name === "create_categories"
  );
  const editAccess = user?.role?.accesses?.find(
    (x) => x.name === "edit_categories"
  );
  const deleteAccess = user?.role?.accesses?.find(
    (x) => x.name === "delete_categories"
  );

  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [registerMode, setRegisterMode] = useState(true);
  const [categoryEdit, setCategoryEdit] = useState({});
  const [categoryDelete, setCategoryDelete] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const filteredList = categoriesList.filter(
    (x) => x.code.includes(search) || x.name.includes(search)
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
    getCategories();
  }, []);

  function getCategories() {
    setLoading(true);
    categoryService
      .getAll()
      .then((categories) => {
        setCategoriesList(categories);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }

  function edit(category) {
    setCategoryEdit(category);
    setRegisterMode(false);

    if (windowSize[0] <= 992) {
      setModalEdit(true);
    }
  }

  function remove(category) {
    setCategoryDelete(category);
    setModalDelete(true);
  }

  function changeMode() {
    setRegisterMode(true);
    setCategoryEdit({});

    if (windowSize[0] <= 992) {
      setModalRegister(true);
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="header-container">
        <div className="left-header">
          <h3 className="mb-3 ps-1">Categorias</h3>
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
              placeholder="Pesquise uma categoria ..."
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
                  <CategoryCard
                    item={item}
                    edit={edit}
                    remove={remove}
                    categoryEdit={categoryEdit}
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
              <RegisterForm getCategories={getCategories} />
            ) : (
              !registerMode &&
              editAccess && (
                <EditForm
                  getCategories={getCategories}
                  categoryEdit={categoryEdit}
                  changeMode={changeMode}
                />
              )
            )}
            {!registerAccess && (
              <label className="ms-3 my-2 bold">
                Não tem permissões para criar categorias.
              </label>
            )}
            {!editAccess && (
              <label className="ms-3 mb-2 bold">
                Não tem permissões para editar categorias.
              </label>
            )}
          </div>
        )}
      </div>
      <ModalDelete
        categoryDelete={categoryDelete}
        show={modalDelete}
        handleClose={() => setModalDelete(false)}
        getCategories={getCategories}
        changeMode={changeMode}
        categoryEdit={categoryEdit}
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
            getCategories={getCategories}
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
            getCategories={getCategories}
            categoryEdit={categoryEdit}
            changeMode={changeMode}
            closeForm={() => {
              setModalEdit(false);
              setCategoryEdit({});
              setRegisterMode(true);
            }}
            closeButton
          />
        </div>
      </Modal>
    </div>
  );
}

export default Categories;
