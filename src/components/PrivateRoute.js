import React from "react";
import { Navigate } from "react-router-dom";

import Nav from "./Nav";

function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  if (user) {
    return (
      <>
        <Nav />
        {children}
      </>
    );
  }

  return <Navigate to="/login" />;
}

export default PrivateRoute;
