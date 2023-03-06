import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { unityService } from "../../services/unity.service";

import ProductCard from "./components/productCard";
import RegisterForm from "./components/registerForm";
import EditForm from "./components/editForm";
import ModalDelete from "./components/modalDelete";
import ModalMoreInfo from "./components/modalMoreInfo";

function Products() {
  const user = JSON.parse(localStorage.getItem("user"));

  const registerAccess = user?.role?.accesses?.find(
    (x) => x.name === "create_products"
  );
  const editAccess = user?.role?.accesses?.find(
    (x) => x.name === "edit_products"
  );
  const deleteAccess = user?.role?.accesses?.find(
    (x) => x.name === "delete_products"
  );

  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingForm, setLoadingForm] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [registerMode, setRegisterMode] = useState(true);
  const [categories, setCategories] = useState([]);
  const [unities, setUnities] = useState([]);
  const [productInfo, setProductInfo] = useState({});
  const [productEdit, setProductEdit] = useState({});
  const [productDelete, setProductDelete] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalMoreInfo, setModalMoreInfo] = useState(false);

  const filteredList = productsList.filter(
    (x) =>
      x.code.includes(search) ||
      x.name.includes(search) ||
      x.category.code.includes(search) ||
      x.category.name.includes(search)
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
    getProducts();
    getCategories();
    getUnities();
  }, []);

  function getProducts() {
    setLoading(true);
    productService
      .getAll()
      .then((products) => {
        setProductsList(products);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }

  function getCategories() {
    setLoadingForm(true);
    categoryService
      .getAll()
      .then((categories) => {
        setCategories(categories);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoadingForm(false));
  }

  function getUnities() {
    setLoadingForm(true);
    unityService
      .getAll()
      .then((unities) => {
        setUnities(unities);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoadingForm(false));
  }

  function moreInfo(product) {
    setProductInfo(product);
    setModalMoreInfo(true);
  }

  function edit(product) {
    setProductEdit(product);
    setRegisterMode(false);

    if (windowSize[0] <= 992) {
      setModalEdit(true);
    }
  }

  function remove(product) {
    setProductDelete(product);
    setModalDelete(true);
  }

  function changeMode() {
    setRegisterMode(true);
    setProductEdit({});

    if (windowSize[0] <= 992) {
      setModalRegister(true);
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="header-container">
        <div className="left-header">
          <h3 className="mb-3 ps-1">Artigos</h3>
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
              placeholder="Pesquise um artigo / categoria ..."
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
                  <ProductCard
                    item={item}
                    moreInfo={moreInfo}
                    edit={edit}
                    remove={remove}
                    productEdit={productEdit}
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
            {isLoadingForm ? (
              <span className="spinner-border spinner-border-lg align-self-center mt-3" />
            ) : (
              <>
                {registerMode && registerAccess ? (
                  <RegisterForm
                    categories={categories}
                    unities={unities}
                    getProducts={getProducts}
                  />
                ) : (
                  !registerMode &&
                  editAccess && (
                    <EditForm
                      categories={categories}
                      unities={unities}
                      getProducts={getProducts}
                      productEdit={productEdit}
                      changeMode={changeMode}
                    />
                  )
                )}
                {!registerAccess && (
                  <label className="ms-3 my-2 bold">
                    Não tem permissões para criar artigos.
                  </label>
                )}
                {!editAccess && (
                  <label className="ms-3 mb-2 bold">
                    Não tem permissões para editar artigos.
                  </label>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <ModalDelete
        productDelete={productDelete}
        show={modalDelete}
        handleClose={() => setModalDelete(false)}
        getProducts={getProducts}
        changeMode={changeMode}
        productEdit={productEdit}
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
            categories={categories}
            unities={unities}
            getProducts={getProducts}
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
            categories={categories}
            unities={unities}
            getProducts={getProducts}
            productEdit={productEdit}
            changeMode={changeMode}
            closeForm={() => {
              setModalEdit(false);
              setProductEdit({});
              setRegisterMode(true);
            }}
            closeButton
          />
        </div>
      </Modal>
      <ModalMoreInfo
        productInfo={productInfo}
        show={modalMoreInfo}
        handleClose={() => setModalMoreInfo(false)}
      />
    </div>
  );
}

export default Products;
