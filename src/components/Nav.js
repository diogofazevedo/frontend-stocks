import React from "react";
import { NavLink } from "react-router-dom";

import { userService } from "../services/user.service";

function Nav() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="navbar-nav">
          <NavLink to="/" className="nav-item nav-link">
            Home
          </NavLink>
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
            Entradas de stock
          </NavLink>
          <NavLink to="/stockExits" className="nav-item nav-link">
            Saídas de stock
          </NavLink>
          <a onClick={userService.logout} className="nav-item nav-link">
            Terminar sessão
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
