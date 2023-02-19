import React from "react";
import { NavLink } from "react-router-dom";

import { userService } from "../services/user.service";
import LogoWhite from "../images/logo-white.png";

function Nav() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavLink to="/users" className="nav-item nav-link">
              Utilizadores
            </NavLink>
            <NavLink to="/roles" className="nav-item nav-link">
              Papéis
            </NavLink>
            <NavLink to="/categories" className="nav-item nav-link">
              Categorias
            </NavLink>
            <NavLink to="/products" className="nav-item nav-link">
              Artigos
            </NavLink>
            <NavLink to="/stockEntries" className="nav-item nav-link">
              Entradas
            </NavLink>
            <NavLink to="/stockExits" className="nav-item nav-link">
              Saídas
            </NavLink>
          </div>
          <text className="text-white me-4">Olá, {user.name}</text>
          <a
            href="/login"
            onClick={() => userService.logout()}
            className="nav-item nav-link text-danger"
          >
            Terminar sessão
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
