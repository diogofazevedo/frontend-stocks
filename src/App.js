import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/login";
import Home from "./pages/home";
import Users from "./pages/users";
import Roles from "./pages/roles";
import Products from "./pages/products";
import Categories from "./pages/categories";
import Unities from "./pages/unities";
import Locations from "./pages/locations";
import StockEntries from "./pages/stockEntries";
import StockExits from "./pages/stockExits";

import "./index.css";

function App() {
  return (
    <div className="app-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="*" element={<Navigate to="/login" replace />} />
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
            <PrivateRoute access="read_users">
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute access="read_roles">
              <Roles />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute access="read_products">
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute access="read_categories">
              <Categories />
            </PrivateRoute>
          }
        />
        <Route
          path="/unities"
          element={
            <PrivateRoute access="read_unities">
              <Unities />
            </PrivateRoute>
          }
        />
        <Route
          path="/locations"
          element={
            <PrivateRoute access="read_locations">
              <Locations />
            </PrivateRoute>
          }
        />
        <Route
          path="/stockEntries"
          element={
            <PrivateRoute access="read_stock_entries">
              <StockEntries />
            </PrivateRoute>
          }
        />
        <Route
          path="/stockExits"
          element={
            <PrivateRoute access="read_stock_exits">
              <StockExits />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
