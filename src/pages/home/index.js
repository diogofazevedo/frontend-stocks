import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";

import { productService } from "../../services/product.service";
import { stockService } from "../../services/stock.service";
import { stockTransactionService } from "../../services/stockTransaction.service";

import StockCard from "../../components/stock/stockCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingChart, setLoadingChart] = useState(false);
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [stockEntries, setStockEntries] = useState([]);
  const [stockExits, setStockExits] = useState([]);

  const days = 7;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `Entradas e saídas de stock nos últimos ${days} dias`,
        font: {
          size: 16,
        },
      },
    },
    layout: {
      padding: 20,
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  let labels = [];
  for (let index = 0; index < days; index++) {
    labels.push(moment(new Date()).subtract(index, "days").format("DD/MM"));
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Entradas",
        data: stockEntries,
        borderColor: "rgb(13, 110, 253)",
        backgroundColor: "rgba(13, 110, 253, 0.5)",
      },
      {
        label: "Saídas",
        data: stockExits,
        borderColor: "rgb(220, 53, 69)",
        backgroundColor: "rgba(220, 53, 69, 0.5)",
      },
    ],
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    getProducts();
    getStockTransactions();
  }, []);

  function getProducts() {
    setLoading(true);
    productService
      .getAll()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }

  function getStockTransactions() {
    setLoadingChart(true);
    stockTransactionService
      .getAll()
      .then((stockTransactions) => {
        let entriesCount = [];
        let exitsCount = [];

        labels.forEach((element) => {
          const stockEntriesTemp = stockTransactions.filter(
            (x) =>
              x.quantity > 0 && moment(x.created).format("DD/MM") === element
          );
          entriesCount.push(stockEntriesTemp.length);

          const stockExitsTemp = stockTransactions.filter(
            (x) =>
              x.quantity < 0 && moment(x.created).format("DD/MM") === element
          );
          exitsCount.push(stockExitsTemp.length);
        });

        setStockEntries(entriesCount);
        setStockExits(exitsCount);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoadingChart(false));
  }

  function getStock(product) {
    setLoading(true);
    stockService
      .getAllByProduct(product)
      .then((stock) => {
        setStock(stock);
        if (stock.length === 0) {
          toast.error(`Stock inexistente para o artigo ${product}.`);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }
  console.log(stockEntries, stockExits);
  return (
    <div className="container-fluid p-4">
      <div className="header-container">
        <div className="left-header">
          <h3 className="mb-3 ps-1">Consulta de stock</h3>
          <div className="input-group px-1">
            <span className="input-group-text bg-dark">
              <FontAwesomeIcon
                icon={faListAlt}
                className="text-white border-0"
              />
            </span>
            <select
              className="form-select"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setStock([]);
                if (e.target.value) {
                  getStock(e.target.value);
                }
              }}
              disabled={isLoading}
            >
              <option value={""}>Escolha um artigo ...</option>
              {products.map((item) => {
                return (
                  <option value={item.code}>
                    {item.name} ({item.code})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="body-container">
        <div className="list-container">
          {isLoading ? (
            <span className="spinner-border spinner-border-lg" />
          ) : (
            <>
              {stock.map((item) => {
                return <StockCard item={item} removeButtons queryPage />;
              })}
            </>
          )}
        </div>
        {windowSize[0] > 992 && (
          <div className="card rigth-container">
            {isLoadingChart ? (
              <span className="spinner-border spinner-border-lg align-self-center mt-3" />
            ) : (
              <Line options={options} data={data} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
