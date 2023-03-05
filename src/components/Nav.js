import React from "react";
import { NavLink } from "react-router-dom";

import { userService } from "../services/user.service";
import LogoWhite from "../images/logo-white.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function Nav() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="navbar navbar-expand-xl navbar-dark bg-dark">
      <div className="container-fluid mx-3">
        <a className="navbar-brand me-4" href="/">
          <img src={LogoWhite} alt="Logo" className="logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto mb-2 mb-lg-0">
            {user?.role?.accesses?.find((x) => x.name === "read_users") && (
              <NavLink to="/users" className="nav-item nav-link">
                Utilizadores
              </NavLink>
            )}
            {user?.role?.accesses?.find((x) => x.name === "read_roles") && (
              <NavLink to="/roles" className="nav-item nav-link">
                Papéis
              </NavLink>
            )}
            {user?.role?.accesses?.find((x) => x.name === "read_products") && (
              <NavLink to="/products" className="nav-item nav-link">
                Artigos
              </NavLink>
            )}
            {user?.role?.accesses?.find(
              (x) => x.name === "read_categories"
            ) && (
              <NavLink to="/categories" className="nav-item nav-link">
                Categorias
              </NavLink>
            )}
            {user?.role?.accesses?.find((x) => x.name === "read_unities") && (
              <NavLink to="/unities" className="nav-item nav-link">
                Unidades
              </NavLink>
            )}
            {user?.role?.accesses?.find((x) => x.name === "read_locations") && (
              <NavLink to="/locations" className="nav-item nav-link">
                Localizações
              </NavLink>
            )}
            {user?.role?.accesses?.find(
              (x) => x.name === "read_stock_entries"
            ) && (
              <NavLink to="/stockEntries" className="nav-item nav-link">
                Entradas
              </NavLink>
            )}
            {user?.role?.accesses?.find(
              (x) => x.name === "read_stock_exits"
            ) && (
              <NavLink to="/stockExits" className="nav-item nav-link">
                Saídas
              </NavLink>
            )}
          </div>
          {user?.imageUrl && (
            <img src={user?.imageUrl} alt="Imagem" className="image me-3" />
          )}
          <label className="text-white me-4">Olá, {user?.name}</label>
          <a
            href="/login"
            onClick={() => userService.logout()}
            className="nav-item nav-link text-danger"
          >
            Terminar sessão
            <FontAwesomeIcon icon={faRightFromBracket} className="ms-2" />
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
