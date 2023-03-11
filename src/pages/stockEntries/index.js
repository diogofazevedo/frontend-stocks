import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

import { stockTransactionService } from "../../services/stockTransaction.service";
import { productService } from "../../services/product.service";
import { locationService } from "../../services/location.service";

import StockCard from "../../components/stock/stockCard";
import RegisterForm from "./components/registerForm";
import EditForm from "./components/editForm";
import ModalMoreInfo from "../../components/stock/modalMoreInfo";

function StockEntries() {
  const user = JSON.parse(localStorage.getItem("user"));

  const registerAccess = user?.role?.accesses?.find(
    (x) => x.name === "create_stock_entries"
  );
  const editAccess = user?.role?.accesses?.find(
    (x) => x.name === "edit_stock_entries"
  );

  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingForm, setLoadingForm] = useState(false);
  const [stockEntriesList, setStockEntriesList] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [registerMode, setRegisterMode] = useState(true);
  const [stockEntryInfo, setStockEntryInfo] = useState({});
  const [stockEntryEdit, setStockEntryEdit] = useState({});
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalMoreInfo, setModalMoreInfo] = useState(false);

  const filteredList = stockEntriesList.filter(
    (x) =>
      x.product.code.includes(search) ||
      x.product.name.includes(search) ||
      x.lot?.includes(search) ||
      x.serialNumber?.includes(search)
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
    getStockEntries();
    getProducts();
    getLocations();
  }, []);

  function getStockEntries() {
    setLoading(true);
    stockTransactionService
      .getAllByType("ENT")
      .then((stockEntries) => {
        setStockEntriesList(stockEntries);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }

  function getProducts() {
    setLoadingForm(true);
    productService
      .getAll()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoadingForm(false));
  }

  function getLocations() {
    setLoadingForm(true);
    locationService
      .getAll()
      .then((locations) => {
        setLocations(locations);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      })
      .finally(() => setLoadingForm(false));
  }

  function moreInfo(stockEntry) {
    setStockEntryInfo(stockEntry);
    setModalMoreInfo(true);
  }

  function edit(stockEntry) {
    setStockEntryEdit(stockEntry);
    setRegisterMode(false);

    if (windowSize[0] <= 992) {
      setModalEdit(true);
    }
  }

  function changeMode() {
    setRegisterMode(true);
    setStockEntryEdit({});

    if (windowSize[0] <= 992) {
      setModalRegister(true);
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="header-container">
        <div className="left-header">
          <h3 className="mb-3 ps-1">Entradas de stock</h3>
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
              placeholder="Pesquise um artigo ..."
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
                  <StockCard
                    item={item}
                    moreInfo={moreInfo}
                    edit={edit}
                    stockEdit={stockEntryEdit}
                    editAccess={editAccess}
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
                    products={products}
                    locations={locations}
                    getStockEntries={getStockEntries}
                  />
                ) : (
                  !registerMode &&
                  editAccess && (
                    <EditForm
                      products={products}
                      locations={locations}
                      getStockEntries={getStockEntries}
                      stockEntryEdit={stockEntryEdit}
                      changeMode={changeMode}
                    />
                  )
                )}
                {!registerAccess && (
                  <label className="ms-3 my-2 bold">
                    Não tem permissões para criar entradas de stock.
                  </label>
                )}
                {!editAccess && (
                  <label className="ms-3 mb-2 bold">
                    Não tem permissões para editar entradas de stock.
                  </label>
                )}
              </>
            )}
          </div>
        )}
      </div>
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
            products={products}
            locations={locations}
            getStockEntries={getStockEntries}
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
            products={products}
            locations={locations}
            getStockEntries={getStockEntries}
            stockEntryEdit={stockEntryEdit}
            changeMode={changeMode}
            closeForm={() => {
              setModalEdit(false);
              setStockEntryEdit({});
              setRegisterMode(true);
            }}
            closeButton
          />
        </div>
      </Modal>
      <ModalMoreInfo
        stockInfo={stockEntryInfo}
        show={modalMoreInfo}
        handleClose={() => setModalMoreInfo(false)}
      />
    </div>
  );
}

export default StockEntries;
