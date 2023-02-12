import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/login";
import Home from "./pages/home";
import Users from "./pages/users";
import Roles from "./pages/roles";
import Categories from "./pages/categories";
import Products from "./pages/products";
import Unities from "./pages/unities";
import Locations from "./pages/locations";
import StockEntries from "./pages/stockEntries";
import StockExits from "./pages/stockExits";

import "./index.css";

function App() {
  return (
    <div className="app-container">
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <Roles />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/unities"
          element={
            <PrivateRoute>
              <Unities />
            </PrivateRoute>
          }
        />
        <Route
          path="/locations"
          element={
            <PrivateRoute>
              <Locations />
            </PrivateRoute>
          }
        />
        <Route
          path="/stockEntries"
          element={
            <PrivateRoute>
              <StockEntries />
            </PrivateRoute>
          }
        />
        <Route
          path="/stockExits"
          element={
            <PrivateRoute>
              <StockExits />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
